# insights/tests/test_history.py
import pytest
from datetime import datetime, time, timedelta

from django.core.cache import cache
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

from notes.models import Note

User = get_user_model()


def _monday_of_current_week():
    today = timezone.localdate()
    return today - timedelta(days=today.weekday())  # Monday


def _aware_dt(daydate, hh=10, mm=0, ss=0):
    """Build a timezone-aware datetime on a specific local date/time."""
    tz = timezone.get_current_timezone()
    return tz.localize(datetime.combine(daydate, time(hh, mm, ss)))


@pytest.fixture(autouse=True)
def clear_cache():
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_token_client(api_client):
    """Create an email-based user, attach Token auth, and return (user, client)."""
    user = User.objects.create_user(email="user1@example.com", password="pass1234")
    token = Token.objects.create(user=user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return user, api_client


@pytest.mark.django_db
def test_history_returns_seven_days_and_latest_per_day(user_token_client):
    user, client = user_token_client
    monday = _monday_of_current_week()

    # Two notes on the SAME day; latest should win
    early = _aware_dt(monday, 9, 0, 0)
    late = _aware_dt(monday, 18, 30, 0)

    n1 = Note.objects.create(
        user=user,
        note="early",
        mood_value_snapshot=2,
        created_at=early,  # will be overwritten below to ensure DB saves it
    )
    # Ensure created_at is persisted as given
    Note.objects.filter(pk=n1.pk).update(created_at=early)

    n2 = Note.objects.create(
        user=user,
        note="late",
        mood_value_snapshot=4,
        created_at=late,
    )
    Note.objects.filter(pk=n2.pk).update(created_at=late)

    url = reverse("insights-history")
    resp = client.get(f"{url}?week_offset=0")
    assert resp.status_code == 200
    data = resp.json()

    assert "graph" in data and len(data["graph"]) == 7
    assert "timeline" in data

    # Latest per day should be reflected in timeline (snippet starts with "late")
    assert any(item["snippet"].startswith("late") for item in data["timeline"])

    # The graph should have at least one non-null value for Monday
    monday_iso = monday.isoformat()
    monday_point = next(p for p in data["graph"] if p["date"] == monday_iso)
    assert monday_point["mood_value"] == 4


@pytest.mark.django_db
def test_history_week_offset_bounds(user_token_client):
    user, client = user_token_client
    url = reverse("insights-history")

    # Negative should 400
    resp = client.get(f"{url}?week_offset=-1")
    assert resp.status_code == 400

    # Non-integer should 400
    resp = client.get(f"{url}?week_offset=abc")
    assert resp.status_code == 400


@pytest.mark.django_db
def test_history_is_user_scoped(user_token_client):
    user1, client = user_token_client
    user2 = User.objects.create_user(email="user2@example.com", password="pass1234")

    monday = _monday_of_current_week()
    dt_user2 = _aware_dt(monday, 11, 0, 0)

    # Create a note for a different user
    n_other = Note.objects.create(
        user=user2,
        note="other user note",
        mood_value_snapshot=5,
        created_at=dt_user2,
    )
    Note.objects.filter(pk=n_other.pk).update(created_at=dt_user2)

    url = reverse("insights-history")
    resp = client.get(url)
    assert resp.status_code == 200
    data = resp.json()

    # Ensure no timeline item shows the other user's text
    assert all("other user note" != t.get("snippet") for t in data["timeline"])


@pytest.mark.django_db
def test_history_missing_days_show_nulls_in_graph(user_token_client):
    user, client = user_token_client
    monday = _monday_of_current_week()

    # Only one note on Wednesday
    wednesday = monday + timedelta(days=2)
    dt = _aware_dt(wednesday, 16, 0, 0)
    n = Note.objects.create(
        user=user,
        note="mid-week",
        mood_value_snapshot=3,
        created_at=dt,
    )
    Note.objects.filter(pk=n.pk).update(created_at=dt)

    url = reverse("insights-history")
    resp = client.get(url)
    data = resp.json()

    # Graph has 7 days; several should be null
    values = [p["mood_value"] for p in data["graph"]]
    assert len(values) == 7
    assert any(v is None for v in values)  # at least one empty day


@pytest.mark.django_db
def test_history_cache_basic_ttl_behavior(user_token_client):
    """
    First call populates cache (5 min TTL). A second call made immediately should
    return the same data even if new notes are created in between. Clearing cache
    should reflect new data.
    """
    user, client = user_token_client
    monday = _monday_of_current_week()

    # Seed one note on Monday
    dt1 = _aware_dt(monday, 9, 0, 0)
    a = Note.objects.create(
        user=user, note="A", mood_value_snapshot=2, created_at=dt1
    )
    Note.objects.filter(pk=a.pk).update(created_at=dt1)

    url = reverse("insights-history")

    # First call → caches
    resp1 = client.get(url)
    assert resp1.status_code == 200
    data1 = resp1.json()
    timeline_len_1 = len(data1["timeline"])

    # Create a new note same week (should not appear until cache expires/clears)
    dt2 = _aware_dt(monday + timedelta(days=1), 10, 0, 0)
    b = Note.objects.create(
        user=user, note="B", mood_value_snapshot=5, created_at=dt2
    )
    Note.objects.filter(pk=b.pk).update(created_at=dt2)

    # Immediate second call → should be a cache hit; same timeline length
    resp2 = client.get(url)
    data2 = resp2.json()
    assert len(data2["timeline"]) == timeline_len_1

    # After clearing cache → new data should appear
    cache.clear()
    resp3 = client.get(url)
    data3 = resp3.json()
    assert len(data3["timeline"]) == timeline_len_1 + 1

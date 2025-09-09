# insights/tests/test_note_snapshot_signal.py
import pytest
from django.utils import timezone
from datetime import timedelta

from django.contrib.auth import get_user_model
from moods.models import Mood
from notes.models import Note

User = get_user_model()


@pytest.mark.django_db
def test_snapshot_set_on_create():
    user = User.objects.create_user(email="snap@test.com", password="x")
    mood = Mood.objects.create(name="Happy", emoji="🙂", category="positive")
    n = Note.objects.create(user=user, mood=mood, note="feels good")
    assert n.mood_value_snapshot == 4


@pytest.mark.django_db
def test_snapshot_updates_when_mood_changes():
    user = User.objects.create_user(email="snap2@test.com", password="x")
    happy = Mood.objects.create(name="Happy", emoji="🙂", category="positive")
    sad = Mood.objects.create(name="Sad", emoji="☹️", category="negative")

    n = Note.objects.create(user=user, mood=happy, note="ok")
    assert n.mood_value_snapshot == 4

    n.mood = sad
    n.save()
    n.refresh_from_db()
    assert n.mood_value_snapshot == 2


@pytest.mark.django_db
def test_explicit_snapshot_not_overwritten():
    user = User.objects.create_user(email="snap3@test.com", password="x")
    neutral = Mood.objects.create(name="Calm", emoji="😌", category="neutral")

    # Explicit value should win (even if mood is neutral=3)
    n = Note.objects.create(user=user, mood=neutral, note="set explicit", mood_value_snapshot=5)
    assert n.mood_value_snapshot == 5

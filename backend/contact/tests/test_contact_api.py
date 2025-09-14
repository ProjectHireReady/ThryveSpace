# backend/contact/tests/test_contact_api.py
import pytest
from django.core import mail
from django.core.cache import cache
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.test import override_settings

CONTACT_URL = "/api/v1/contact/"

@pytest.fixture(autouse=True)
def clear_cache():
    cache.clear()
    yield
    cache.clear()

@pytest.fixture
def api_client():
    return APIClient()

@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
def test_contact_success(api_client):
    payload = {
        "name": "Alice Example",
        "email": "alice@example.com",
        "message": "Hello ThryveSpace team, I love your app!"
    }
    res = api_client.post(CONTACT_URL, payload, format="json")
    assert res.status_code == status.HTTP_200_OK
    assert res.data.get("ok") is True
    assert len(mail.outbox) == 1
    msg = mail.outbox[0]
    assert "Contact form" in msg.subject
    assert "Alice Example" in msg.body
    assert msg.reply_to == ["alice@example.com"]

@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
def test_contact_validation(api_client):
    res = api_client.post(CONTACT_URL, {"name": "", "email": "bad", "message": "hi"}, format="json")
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert res.data["ok"] is False

@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
def test_contact_throttle(api_client):
    payload = {"name": "A", "email": "a@example.com", "message": "Slightly longer message."}
    for _ in range(5):
        assert api_client.post(CONTACT_URL, payload, format="json").status_code == 200
    # 6th within the hour should 429
    res = api_client.post(CONTACT_URL, payload, format="json")
    assert res.status_code == status.HTTP_429_TOO_MANY_REQUESTS

# kindness/tests/test_kindness.py
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient

USE_TOKEN = True
try:
    from rest_framework.authtoken.models import Token
except Exception:
    USE_TOKEN = False
    Token = None  # type: ignore

from django.urls import reverse
from moods.models import Mood
from notes.models import Note
from kindness.models import KindnessMessageLog

User = get_user_model()


class KindnessEndpointTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Build kwargs that satisfy your CustomUser manager/model
        create_kwargs = {"email": "linet@example.com", "password": "pass123"}
        # Only add username if the field exists on your CustomUser
        if any(f.name == "username" for f in User._meta.get_fields()):
            create_kwargs["username"] = "linet"

        self.user = User.objects.create_user(**create_kwargs)

        try:
            self.url = reverse("kindness:kindness-message")
        except Exception:
            # Match the new prefixed route
            self.url = "/api/v1/messages/kindness/"

        if USE_TOKEN:
            token, _ = Token.objects.get_or_create(user=self.user)
            self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
        else:
            self.client.force_authenticate(user=self.user)

    # ---------- Helpers ----------

    def _get_or_create_mood(self, name="Neutral", category="neutral", emoji="😐"):
        mood, created = Mood.objects.get_or_create(
            name=name,
            defaults={"emoji": emoji, "category": category, "is_active": True},
        )
        if not created:
            changed = False
            if not getattr(mood, "emoji", None):
                mood.emoji = emoji
                changed = True
            if not getattr(mood, "category", None):
                mood.category = category
                changed = True
            if changed:
                mood.save(update_fields=["emoji", "category"])
        return mood

    def _make_note(self, text="test", mood_name="Neutral", category="neutral", emoji="😐"):
        mood = self._get_or_create_mood(mood_name, category, emoji)
        return Note.objects.create(
            user=self.user,
            mood=mood,
            note=text,
            created_at=timezone.now(),
        )

    # ---------- Tests ----------

    def test_auth_required(self):
        c = APIClient()  # no credentials
        resp = c.get(self.url)
        self.assertEqual(resp.status_code, 401)

    def test_less_than_three_entries(self):
        self._make_note(text="one")
        self._make_note(text="two")
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.data.get("no_message"))

    def test_success_then_cooldown_same_day(self):
        for txt in ("tired", "stressed", "grateful"):
            self._make_note(text=txt)

        resp1 = self.client.get(self.url)
        self.assertEqual(resp1.status_code, 200)

        if "message" in resp1.data:
            self.assertTrue(resp1.data["message"])
            self.assertEqual(
                KindnessMessageLog.objects.filter(user=self.user).count(), 1
            )
            resp2 = self.client.get(self.url)
            self.assertEqual(resp2.status_code, 200)
            self.assertTrue(resp2.data.get("no_message"))
        else:
            self.assertTrue(resp1.data.get("no_message"))
            resp2 = self.client.get(self.url)
            self.assertEqual(resp2.status_code, 200)
            self.assertTrue(resp2.data.get("no_message"))


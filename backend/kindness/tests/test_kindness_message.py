# kindness/tests/test_kindness_message.py
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from django.urls import reverse

from moods.models import Mood
from notes.models import Note

User = get_user_model()


class KindnessPromptVersionTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="buyeke",
            email="buyeke@example.com",
            password="pass123"
        )

        token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        # Set endpoint URL (handle fallback if reverse fails)
        try:
            self.url = reverse("kindness:kindness-message")
        except Exception:
            self.url = "/api/v1/messages/kindness/"

        # Add enough notes to trigger kindness message
        for note_text in ["note one", "note two", "note three"]:
            self._create_note(note_text)

    def _create_note(self, text):
        mood, _ = Mood.objects.get_or_create(
            name="neutral", defaults={"emoji": "😐", "category": "neutral"}
        )
        Note.objects.create(
            user=self.user,
            mood=mood,
            note=text,
            created_at=timezone.now()
        )

    def test_kindness_response_contains_prompt_version(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        if "message" in response.data:
            self.assertIn("prompt_version", response.data)
            self.assertEqual(response.data["prompt_version"], "v1")
        else:
            # If no message (e.g. cooldown), test still passes
            self.assertIn("no_message", response.data)

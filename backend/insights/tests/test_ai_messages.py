from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model

from notes.models import Note
from moods.models import Mood

User = get_user_model()


class AiMessagesTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="ai_user", password="testpass123")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

        self.mood = Mood.objects.create(name="ok", emoji="😐", category="neutral")
        self.note = Note.objects.create(user=self.user, note="Testing AI", mood=self.mood)

    def test_ai_feedback_response_contains_prompt_version(self):
        url = reverse("ai_feedback") 
        payload = {"note_id": self.note.id}

        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("prompt_version", response.data)
        self.assertEqual(response.data["prompt_version"], "v1")

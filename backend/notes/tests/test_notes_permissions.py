from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.urls import reverse
from notes.models import Note
from moods.models import Mood
from django.contrib.auth import get_user_model

User = get_user_model()


class NoteUpdateDeleteTests(APITestCase):
    def setUp(self):
        # Create two users
        self.user = User.objects.create_user(email="user1@example.com", password="pass1234")
        self.other_user = User.objects.create_user(
            email="user2@example.com", password="pass1234"
        )

        # Create a token for authentication
        self.token = Token.objects.create(user=self.user)

        # Create mood for logging
        self.mood = Mood.objects.create(name="Happy", category="positive", emoji="😊")

        # Create a note for self.user
        self.note = Note.objects.create(
            note="Some content", user=self.user, mood=self.mood
        )

        self.url = reverse("note-detail", args=[self.note.id])

    def test_owner_can_update_note(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        response = self.client.patch(self.url, {"note": "Updated title"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["note"], "Updated title")

    def test_non_owner_cannot_update_note(self):
        # Authenticate as another user
        token_other = Token.objects.create(user=self.other_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token_other.key}")
        response = self.client.patch(self.url, {"note": "Hacked title"}, format="json")
        self.assertEqual(response.status_code, 404)

    def test_owner_can_delete_note(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Note.objects.filter(id=self.note.id).exists())

    def test_non_owner_cannot_delete_note(self):
        token_other = Token.objects.create(user=self.other_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token_other.key}")
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 404)

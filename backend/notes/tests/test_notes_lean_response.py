# notes/tests/test_notes_api.py

from django.test import TestCase
from rest_framework.test import APIClient
from django.utils import timezone
from notes.models import Note
from moods.models import Mood
from django.contrib.auth import get_user_model

User = get_user_model()

class NoteAPITests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="test@example.com", password="pass1234")
        self.mood = Mood.objects.create(name="Grateful", category="Positive")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_note_returns_lean_response(self):
        data = {"note": "Hello test", "mood_name": "Grateful"}
        response = self.client.post("/api/v1/notes/", data)
        json = response.json()

        self.assertEqual(response.status_code, 201)
        self.assertIn("id", json)
        self.assertIn("note", json)
        self.assertIn("mood", json)
        self.assertNotIn("user", json)

    def test_patch_note_returns_lean_response(self):
        note = Note.objects.create(note="Old note", user=self.user, mood=self.mood)
        response = self.client.patch(f"/api/v1/notes/{note.id}/", {"note": "Updated note"})
        json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json["note"], "Updated note")
        self.assertNotIn("user", json)

    def test_migration_returns_list_of_lean_notes(self):
        payload = {
            "entries": [
                {
                    "note": "Migrated note",
                    "mood_id": str(self.mood.id),
                    "created_at": timezone.now().isoformat()
                }
            ]
        }

        response = self.client.post("/api/v1/notes/migrate/", data=payload, format="json")
        json = response.json()

        self.assertEqual(response.status_code, 201)
        self.assertIn("notes", json)
        self.assertEqual(len(json["notes"]), 1)
        self.assertNotIn("user", json["notes"][0])

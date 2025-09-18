# notes/tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from notes.models import Note
from moods.models import Mood

User = get_user_model()


class NoteTests(APITestCase):

    def setUp(self):
        # Create a test user and log them in
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpassword'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create a sample mood for testing with an INTEGER category
        # Assuming 1 represents a positive mood, based on your previous errors.
        self.mood = Mood.objects.create(name='Happy', emoji='😀', category=1)
        
        # Create a sample note for the tests
        self.note = Note.objects.create(
            user=self.user,
            note="This is an initial note.",
            mood=self.mood,
            # The note creation also needs a value for mood_value_snapshot
            mood_value_snapshot=self.mood.category
        )
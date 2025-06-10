# backend/notes/models.py
from django.db import models
from django.conf import settings # To get the AUTH_USER_MODEL
import uuid
from moods.models import Mood # Import Mood from the new moods app

class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notes')
    mood = models.ForeignKey(Mood, on_delete=models.SET_NULL, null=True, blank=True, related_name='notes')
    content = models.TextField() # This is the field for your journal text
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Useful for admin panel and debugging
        # F-strings typically use double quotes for the string itself for clarity
        return f"Note by {self.user.username} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"
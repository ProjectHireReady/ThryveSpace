# backend/notes/models.py

from django.db import models
from django.conf import settings
import uuid
from moods.models import Mood


class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes"
    )
    mood = models.ForeignKey(
        Mood, on_delete=models.SET_NULL, null=True, blank=True, related_name="notes"
    )
    note = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note by {self.user.username} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"

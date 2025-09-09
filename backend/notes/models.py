# backend/notes/models.py

from django.db import models
from django.conf import settings
import uuid
from moods.models import Mood


class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes",
    )

    mood = models.ForeignKey(
        Mood,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notes",
    )

    # Free‑text content of the note
    note = models.TextField(blank=True)

    # Snapshot of mood value (1..5) at creation/update time — used by insights history
    mood_value_snapshot = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        # Be robust if username isn't present (email-only auth)
        who = getattr(self.user, "username", None) or getattr(self.user, "email", "user")
        return f"Note by {who} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"

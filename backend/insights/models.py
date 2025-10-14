from django.db import models
from django.conf import settings
from uuid import uuid4

# Create your models here.


class Insight(models.Model):
    TYPE_CHOICES = [
        ("note_feedback", "Note Feedback"),
        ("summary", "Summary"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    type = models.CharField(
        max_length=20, choices=TYPE_CHOICES, default="note_feedback"
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.JSONField(blank=True, null=True)
    week_start = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Insight {self.id} for user {self.user.get_full_name()}"

from django.db import models
from uuid import uuid4

CATEGORY_CHOICES = [
    ("positive", "Positive"),
    ("negative", "Negative"),
    ("neutral", "Neutral"),
]


class Mood(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    emoji = models.CharField(max_length=10)
    category = models.CharField(
        max_length=30,
        blank=True,
        null=True,
        choices=CATEGORY_CHOICES,
    )  # Optional field for categorization
    is_active = models.BooleanField(
        default=True
    )  # To indicate if the mood is currently active
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.emoji} {self.name}"

    class Meta:
        ordering = ["name"]  # Optional: to order moods by name

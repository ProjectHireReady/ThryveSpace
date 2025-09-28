from django.db import models
from uuid import uuid4

# Assuming CATEGORY_CHOICES is now imported from a constants file
# If you didn't create moods/constants.py, ensure CATEGORY_CHOICES is defined here.

# --- If you haven't moved it to constants.py, keep it here: ---
CATEGORY_CHOICES = [
    ("very negative", "Very Negative"),
    ("negative", "Negative"),
    ("neutral", "Neutral"),
    ("positive", "Positive"),
    ("very positive", "Very Positive"),
]
# -------------------------------------------------------------


class Mood(models.Model):
    """
    Table to store individual moods that users can select, satisfying the
    required fields: id, name, icon, category info, updated_at.
    """
    # 1. id
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    
    # 2. name
    name = models.CharField(max_length=100, unique=True)
    
    # 3. icon (Renamed from emoji to match requested schema)
    icon = models.CharField(
        max_length=10, 
        help_text="The emoji or short icon string representing the mood."
    )
    
    # 4. category info
    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        help_text="The general category (e.g., positive, neutral) this mood belongs to."
    )
    
    # 5. updated_at
    updated_at = models.DateTimeField(auto_now=True)

    # Other necessary fields from your implementation:
    is_active = models.BooleanField(default=True)
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        # Use 'icon' field in __str__
        return f"{self.icon} {self.name}"

    class Meta:
        ordering = ["name"]
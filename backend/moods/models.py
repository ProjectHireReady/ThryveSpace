from django.db import models
from uuid import uuid4

# --- CATEGORY_CHOICES (Define if not in constants.py) ---
CATEGORY_CHOICES = [
    ("very negative", "Very Negative"),
    ("negative", "Negative"),
    ("neutral", "Neutral"),
    ("positive", "Positive"),
    ("very positive", "Very Positive"),
]
# --------------------------------------------------------

class MoodCategory(models.Model):
    """
    Table to define general mood categories.
    Fields: value, label, icon, updated_at (REQUIRED for ETag).
    """
    value = models.CharField(max_length=50, choices=CATEGORY_CHOICES) 
    label = models.CharField(max_length=50) 
    
    # REQUIRED FIELD: 'icon'
    icon = models.URLField(
        blank=True, 
        null=True, 
        help_text="URL for the category icon image."
    ) 
    
    # 🟢 FIX: Added updated_at field for ETag calculation
    updated_at = models.DateTimeField(auto_now=True) # <-- ETag FIX

    class Meta:
        verbose_name_plural = "Mood Categories"
        ordering = ['value']

    def __str__(self):
        return self.label

# --------------------------------------------------------

class Mood(models.Model):
    """
    Table to store individual moods.
    Fields: id, name, icon (URL), category, updated_at (REQUIRED).
    """
    # 1. id
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    
    # 2. name
    name = models.CharField(max_length=100, unique=True)
    
    # 3. emoji_char 
    emoji_char = models.CharField(
        max_length=10, 
        default="😊",
        help_text="The emoji character (e.g., 😃)."
    )
    
    # 4. icon 
    icon = models.URLField(
        blank=True, 
        null=True,
        help_text="URL for the mood's image illustration (mapped to 'icon' in API)."
    )

    # 5. category info
    category = models.ForeignKey(
        MoodCategory, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='moods_in_category'
    )
    
    # 6. updated_at 
    updated_at = models.DateTimeField(auto_now=True)

    # Other necessary fields:
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.emoji_char} {self.name}"

    class Meta:
        ordering = ["name"]
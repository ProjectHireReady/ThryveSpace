from rest_framework import serializers
# Assuming Mood and MoodCategory are correctly imported from .models
from .models import Mood, MoodCategory, CATEGORY_CHOICES 

# Cloudinary icon mapping (Used for seeding, we will use the model's icon field for output)
CATEGORY_ICONS = {
    "positive": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757663590/Positive_yaegjw.svg",
    # ... other URLs ...
}

class MoodCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the MoodCategory model.
    The output fields are exactly: value, label, icon.
    """
    class Meta:
        model = MoodCategory
        # Uses the model's 'icon' field (the URL) directly.
        fields = ['value', 'label', 'icon']
        
class MoodSerializer(serializers.ModelSerializer):
    """
    Serializer for the Mood model.
    The output fields are: id, name, emoji, category, icon.
    """
    
    # Map the internal 'emoji_char' model field to the API output field 'emoji'
    emoji = serializers.CharField(source='emoji_char', read_only=True)
    
    # Map the ForeignKey 'category' to its 'value' string
    category = serializers.CharField(source='category.value', read_only=True)
    
    # The 'icon' field is taken directly from the model

    class Meta:
        model = Mood
        # FINAL FIELDS: id, name, emoji, category, icon (URL)
        fields = ["id", "name", "emoji", "category", "icon"] 
        read_only_fields = ("id",)

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")
        return value

class MoodsCategoriesSerializer(serializers.Serializer):
    """
    Serializer for the final API response structure: {categories: [], moods: []}.
    """
    categories = serializers.SerializerMethodField()
    moods = serializers.SerializerMethodField()
    
    def get_categories(self, obj):
        """Returns a list of all defined categories using the MoodCategorySerializer."""
        # Fetch categories from the model for the most accurate data
        categories = MoodCategory.objects.all()
        return MoodCategorySerializer(categories, many=True).data

    def get_moods(self, obj):
        """Serializes the queryset of Mood objects passed as 'obj'."""
        return MoodSerializer(obj, many=True).data
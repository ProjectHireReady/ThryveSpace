from rest_framework import serializers
from .models import Mood, CATEGORY_CHOICES

class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ("id", "name", "emoji", "category", "image_url")
        read_only_fields = ("id",)

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")
        return value

# New serializer to format the full response
class MoodsCategoriesSerializer(serializers.Serializer):
    categories = serializers.SerializerMethodField()
    moods = serializers.SerializerMethodField()
    
    def get_categories(self, obj):
        """Returns a list of all defined categories from the model choices."""
        return [{'value': value, 'label': label} for value, label in CATEGORY_CHOICES]

    def get_moods(self, obj):
        """Serializes the queryset of Mood objects."""
        # Use the existing MoodSerializer to handle each mood object
        return MoodSerializer(obj, many=True).data
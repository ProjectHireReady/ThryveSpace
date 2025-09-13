from rest_framework import serializers
from .models import Mood, CATEGORY_CHOICES

# Cloudinary icon mapping for categories
CATEGORY_ICONS = {
    "positive": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757663590/Positive_yaegjw.svg",
    "very positive": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757664397/Very_Positive_grjod4.svg",
    "neutral": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757617744/Neutral_j2n5gp.svg",
    "negative": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757615267/Sad_vlwdhy.svg",
    "very negative": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757660403/Lonely_bfgeld.svg",
}

class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ("id", "name", "emoji", "category", "image_url")
        read_only_fields = ("id",)

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")
        return value

class MoodsCategoriesSerializer(serializers.Serializer):
    categories = serializers.SerializerMethodField()
    moods = serializers.SerializerMethodField()
    
    def get_categories(self, obj):
        """Returns a list of all defined categories from the model choices, with icon URLs."""
        return [
            {
                'value': value,
                'label': label,
                'icon_url': CATEGORY_ICONS.get(value)
            }
            for value, label in CATEGORY_CHOICES
        ]

    def get_moods(self, obj):
        """Serializes the queryset of Mood objects."""
        return MoodSerializer(obj, many=True).data

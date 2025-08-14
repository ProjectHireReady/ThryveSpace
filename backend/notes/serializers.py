from rest_framework import serializers
from .models import Note
from moods.serializers import MoodSerializer
from django.contrib.auth import get_user_model
from moods.models import Mood

User = get_user_model()


class NoteSerializer(serializers.ModelSerializer):
    """
    Serializer for READ, UPDATE, DELETE operations.
    It includes nested mood data for the response.
    """

    mood = MoodSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "user", "mood", "note", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "mood", "created_at", "updated_at"]


class NoteCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for CREATE operations (POST requests).
    It accepts 'mood_name' to link a mood.
    """

    mood_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Note
        fields = ["note", "mood_name"]


class NoteMigrationSerializer(serializers.Serializer):
    """
    Serializer for the bulk migration endpoint.
    It validates a list of 'NoteCreateSerializer' objects.
    """

    entries = NoteCreateSerializer(many=True)

from rest_framework import serializers
from .models import Note
from moods.models import Mood
from moods.serializers import MoodSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class NoteInsightSerializer(serializers.ModelSerializer):
    """
    Serializer for insight operations.
    Includes note truncation logic.
    """

    mood = MoodSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "user", "mood", "note", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def truncate_note(self, note_text, max_length=10):
        if len(note_text) > max_length:
            return note_text[:max_length] + "..."
        return note_text

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["note"] = self.truncate_note(representation["note"])
        return representation


class NoteSerializer(serializers.ModelSerializer):
    """
    Serializer for READ, UPDATE, DELETE operations.
    Includes nested mood object and user.
    """

    mood = MoodSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "user", "mood", "note", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "mood", "created_at", "updated_at"]


class NoteCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for CREATE operations (POST requests).
    Accepts 'mood_name' to link a mood by name.
    """

    mood_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Note
        fields = ["note", "mood_name"]


class MigratedNoteSerializer(serializers.Serializer):

    note = serializers.CharField(max_length=500, required=True)
    mood_id = serializers.UUIDField(required=True)
    created_at = serializers.DateTimeField(required=False, allow_null=True)

    def validate_mood_id(self, value):
        try:
            Mood.objects.get(id=value)
        except Mood.DoesNotExist:
            raise serializers.ValidationError(f"Mood with ID {value} does not exist.")
        return value


class NoteMigrationSerializer(serializers.Serializer):
    """
    Serializer for the bulk migration endpoint.
    It validates a list of 'NoteCreateSerializer' objects.
    """

    entries = NoteCreateSerializer(many=True)

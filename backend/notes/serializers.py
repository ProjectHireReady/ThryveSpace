# notes/serializers.py

from rest_framework import serializers
from .models import Note
from moods.models import Mood
from moods.serializers import MoodSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class NoteInsightSerializer(serializers.ModelSerializer):
    """
    Serializer for insight operations.
    Includes note truncation logic for insights display.
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
        fields = ["id", "user", "mood", "note", "title", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "mood", "created_at", "updated_at"]


class NoteCreateSerializer(serializers.ModelSerializer):
    """
    Serializers for CREATE operations (POST requests).
    Accepts 'mood_name' to link a mood by name.
    """

    mood_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Note
        fields = ["note", "title", "mood_name"]


    def create(self, validated_data):
        user = self.context['request'].user
        
        mood_name = validated_data.pop("mood_name", None)
        
        mood_obj = None
        mood_value_snapshot = None
        if mood_name:
            try:
                mood_obj = Mood.objects.get(name__iexact=mood_name)
                # Corrected: Get the integer value from the Mood object's category
                mood_value_snapshot = mood_obj.category
            except Mood.DoesNotExist:
                raise serializers.ValidationError({"mood_name": "Mood not found."})

        note = Note.objects.create(
            user=user,
            mood=mood_obj,
            mood_value_snapshot=mood_value_snapshot,
            **validated_data
        )
        return note


class MigratedNoteSerializer(serializers.Serializer):
    """
    Serializer for a single note entry during bulk migration.
    Now accepts mood_name instead of mood_id for guest entries.
    """

    note = serializers.CharField(max_length=500, required=True)
    mood_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    created_at = serializers.DateTimeField(required=False, allow_null=True)

    def validate_mood_name(self, value):
        if value in [None, ""]:
            return None
        try:
            mood_obj = Mood.objects.get(name__iexact=value)
            return mood_obj.name
        except Mood.DoesNotExist:
            raise serializers.ValidationError(f"Mood '{value}' does not exist.")
        return value


class NoteMigrationSerializer(serializers.Serializer):
    """
    Serializer for the bulk migration endpoint.
    Validates a list of MigratedNoteSerializer entries.
    Intended for bulk guest note migration on signup.
    """
    entries = MigratedNoteSerializer(many=True)


class NoteLeanSerializer(serializers.ModelSerializer):
    """
    Lean serializer for notes (excludes user).
    Used in POST, PATCH, and migration responses for efficiency.
    """

    mood = MoodSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ["id", "mood", "note", "title", "created_at", "updated_at"]
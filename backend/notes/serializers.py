# backend/notes/serializers.py
from rest_framework import serializers
from .models import Note
from moods.serializers import MoodSerializer
from django.contrib.auth import get_user_model

class NoteSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(write_only=True)
    mood_name = serializers.CharField(write_only=True, required=False, allow_blank=True) # For input

    # If you want to nest the mood object in output
    mood = MoodSerializer(read_only=True)

    class Meta:
        model = Note
        # --- IMPORTANT CHANGE HERE ---
        # Ensure 'note' is in this tuple/list instead of 'content'
        fields = ['id', 'user', 'mood', 'note', 'created_at', 'updated_at', 'user_id', 'mood_name']
        read_only_fields = ['id', 'user', 'mood', 'created_at', 'updated_at']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        mood_name = validated_data.pop('mood_name', None)

        User = get_user_model()
        try:
            user_obj = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({'user_id': 'Invalid or non-existent user_id.'})

        mood_obj = None
        if mood_name:
            try:
                from moods.models import Mood # Import here to avoid circular dependency
                mood_obj = Mood.objects.get(name__iexact=mood_name)
            except Mood.DoesNotExist:
                raise serializers.ValidationError({'mood': f"Mood '{mood_name}' not found."})

        # Create the note instance, ensuring 'note' field is used
        note_instance = Note.objects.create(user=user_obj, mood=mood_obj, **validated_data)
        return note_instance

    def to_representation(self, instance):
        # This method controls how the output JSON looks
        representation = super().to_representation(instance)
        # Ensure 'note' is used for output if you have a custom representation
        # If you are just using 'fields' in Meta, DRF handles this automatically.
        # Example if you want to explicitly include 'note' in output:
        # representation['note'] = instance.note
        return representation
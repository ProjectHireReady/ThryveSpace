from rest_framework import serializers
from .models import Note
from moods.serializers import MoodSerializer
from django.contrib.auth import get_user_model
from moods.models import Mood

User = get_user_model()

class NoteSerializer(serializers.ModelSerializer):
feature-backend/notes-edit-delete
    mood_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    mood = MoodSerializer(read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'user', 'mood', 'note', 'created_at', 'updated_at', 'mood_name']
        read_only_fields = ['id', 'user', 'mood', 'created_at', 'updated_at']

    def create(self, validated_data):
        user_obj = validated_data.pop('user')
        mood_name = validated_data.pop('mood_name', None)

        mood_obj = None
        if mood_name:
            try:

                mood_obj = Mood.objects.get(name__iexact=mood_name)
            except Mood.DoesNotExist:
                raise serializers.ValidationError({'mood_name': f"Mood '{mood_name}' not found."})

        note_instance = Note.objects.create(user=user_obj, mood=mood_obj, **validated_data)
        return note_instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation
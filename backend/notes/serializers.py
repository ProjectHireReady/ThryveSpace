# backend/notes/serializers.py

from rest_framework import serializers
from .models import Note
from moods.serializers import MoodSerializer # Assuming you have this
from users.serializers import CustomUserSerializer # Assuming you have this
from moods.models import Mood # Import Mood model
from users.models import CustomUser # Import CustomUser model

class NoteSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True) # Nested user for output
    user_id = serializers.CharField(write_only=True) # For input
    mood = MoodSerializer(read_only=True) # Nested mood for output
    mood_name = serializers.CharField(write_only=True, required=False, allow_blank=True) # For input

    class Meta:
        model = Note
        fields = ['id', 'user', 'mood', 'note', 'created_at', 'updated_at', 'user_id', 'mood_name']
        read_only_fields = ['id', 'created_at', 'updated_at']

    # We need to make 'note' not required for validation at the serializer level if it's blank=True in model
    # However, ModelSerializer usually respects blank=True/null=True from the model.
    # If you get errors for 'note' being required when empty, you might add:
    # note = serializers.CharField(required=False, allow_blank=True)
    # But usually, the model's blank=True is enough.

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        mood_name = validated_data.pop('mood_name', None)

        try:
            user_obj = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({'user_id': 'Invalid user ID.'})

        mood_obj = None
        if mood_name:
            try:
                mood_obj = Mood.objects.get(name__iexact=mood_name)
            except Mood.DoesNotExist:
                raise serializers.ValidationError({'mood_name': f"Mood '{mood_name}' not found."})

        note_instance = Note.objects.create(user=user_obj, mood=mood_obj, **validated_data)
        return note_instance

    def update(self, instance, validated_data):
        # Handle mood_name if it was explicitly passed for update
        # This part is largely handled in the view's .update() override,
        # where we convert mood_name to mood_id.
        # So here, we just apply the validated_data directly.
        # If 'mood' is in validated_data (because view processed mood_name)
        if 'mood' in validated_data:
            instance.mood = validated_data.pop('mood') # Update the mood foreign key

        # Update other fields passed in validated_data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
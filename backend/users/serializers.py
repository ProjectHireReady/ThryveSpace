feature-backend/notes-edit-delete
# backend/users/serializers.py
from rest_framework import serializers
from .models import CustomUser # Make sure to import your CustomUser model

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email'] # Or whatever fields you want to expose

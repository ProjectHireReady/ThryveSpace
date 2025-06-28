from rest_framework import serializers
from .models import CustomUser

class CreateGuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'reset_token', 'is_guest', 'date_joined']
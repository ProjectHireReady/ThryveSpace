from rest_framework import serializers
from .models import CustomUser


class CreateGuestSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source="id", read_only=True)

    class Meta:
        model = CustomUser
        fields = ["user_id", "reset_token", "is_guest", "date_joined"]

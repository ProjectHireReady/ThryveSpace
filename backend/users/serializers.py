from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()


class CreateGuestSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source="id", read_only=True)

    class Meta:
        model = CustomUser
        fields = ["user_id", "reset_token", "is_guest", "date_joined"]


class ResetTokenSerializer(serializers.Serializer):
    reset_token = serializers.CharField(max_length=6)

    def validate_reset_token(self, value):
        try:
            user = User.objects.get(reset_token=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid reset token.")
        self.context["user"] = user
        return value

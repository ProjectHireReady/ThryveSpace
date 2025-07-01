<<<<<<< HEAD
# backend/users/serializers.py
from rest_framework import serializers
from .models import CustomUser # Make sure to import your CustomUser model

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email'] # Or whatever fields you want to expose
=======
from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()


class CreateGuestSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source="id", read_only=True)

    class Meta:
        model = CustomUser
        fields = ["user_id", "username", "reset_token", "is_guest", "date_joined"]


class ResetTokenSerializer(serializers.Serializer):
    reset_token = serializers.CharField(max_length=6)

    def validate_reset_token(self, value):
        try:
            user = User.objects.get(reset_token=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid reset token.")
        self.context["user"] = user
        return value


class GuestUpgradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["username", "first_name", "last_name", "email", "password"]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "min_length": 8,
            }
        }

    def validate(self, attrs):
        user = self.context["request"].user
        if not user or user.is_anonymous:
            raise serializers.ValidationError(
                "You must be logged in to upgrade a guest account."
            )
        return attrs

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.email = validated_data.get("email", instance.email)
        instance.set_password(validated_data.get("password", instance.password))
        instance.is_guest = False
        instance.reset_token = None
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
>>>>>>> 0224ee37605fc331b5ec8907598c63affe6d4363

from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']

class CreateGuestSerializer(serializers.Serializer):
    pass

class ResetTokenSerializer(serializers.Serializer):
    pass

class GuestUpgradeSerializer(serializers.Serializer):
    pass

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    user_id = serializers.CharField(read_only=True)
    token = serializers.CharField(read_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'), username=username, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials.")
        else:
            raise serializers.ValidationError("Must include 'username' and 'password'.")

        token, created = Token.objects.get_or_create(user=user)

        data['user'] = user
        data['user_id'] = str(user.id)
        data['token'] = token.key
        return data
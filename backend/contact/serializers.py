# backend/contact/serializers.py
from rest_framework import serializers

class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120, allow_blank=False, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    message = serializers.CharField(allow_blank=False, max_length=5000, trim_whitespace=True)

    def validate(self, attrs):
        # Extra lightweight guardrails
        msg = attrs.get("message", "")
        if len(msg.strip()) < 10:
            raise serializers.ValidationError({"message": "Please provide a bit more detail (min ~10 chars)."})
        return attrs

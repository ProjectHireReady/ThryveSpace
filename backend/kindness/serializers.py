from rest_framework import serializers

class KindnessResponseSerializer(serializers.Serializer):
    message = serializers.CharField(required=False)
    no_message = serializers.BooleanField(required=False)
    reason = serializers.CharField(required=False)
    meta = serializers.DictField(required=False)

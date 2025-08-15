from rest_framework import serializers
from notes.serializers import NoteInsightSerializer


class GraphPointSerializer(serializers.Serializer):
    date = serializers.DateField()
    mood_value = serializers.IntegerField(allow_null=True)


class WeekSummarySerializer(serializers.Serializer):
    week_start = serializers.DateField()
    week_end = serializers.DateField()
    graph = GraphPointSerializer(many=True)
    timeline = NoteInsightSerializer(many=True)

from datetime import timedelta
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from notes.models import Note
from notes.serializers import NoteInsightSerializer
from .serializers import WeekSummarySerializer

CATEGORY_VALUE_MAP = {
    "very negative": 1,
    "negative": 2,
    "neutral": 3,
    "positive": 4,
    "very positive": 5,
}


@method_decorator(cache_page(60 * 5), name="dispatch")  # cache for 5 minutes
class WeeklyInsightView(APIView):
    """
    GET /api/v1/insights/history/?week_offset=0

    Returns:
      - graph: 7 points (Mon..Sun) where each point is the latest note's mood_value for that day (or null)
      - timeline: list of notes in the week (newest first)
    """

    permission_classes = [permissions.IsAuthenticated]

    def _parse_week_offset(self, request):
        try:
            week_offset = int(request.query_params.get("week_offset", 0))
            if week_offset < 0:
                week_offset = 0
        except ValueError:
            week_offset = 0
        return week_offset

    def _get_week_range(self, week_offset: int):
        today = timezone.localdate()
        current_week_start = today - timedelta(days=today.weekday())
        target_week_start = current_week_start - timedelta(weeks=week_offset)
        target_week_end = target_week_start + timedelta(days=6)
        return target_week_start, target_week_end

    def get(self, request, *args, **kwargs):
        week_offset = self._parse_week_offset(request)
        week_start, week_end = self._get_week_range(week_offset)

        notes = (
            Note.objects.filter(
                user=request.user, created_at__date__range=[week_start, week_end]
            )
            .select_related("mood")
            .order_by("created_at")
        )

        day_mood_map = {}
        for note in notes:
            note_date = note.created_at.date()
            mood_value = (
                CATEGORY_VALUE_MAP.get(note.mood.category, None) if note.mood else None
            )
            day_mood_map[note_date] = mood_value

        graph = []
        for i in range(7):
            d = week_start + timedelta(days=i)
            graph.append({"date": d, "mood_value": day_mood_map.get(d)})
        timeline_qs = notes.order_by("-created_at")
        timeline = NoteInsightSerializer(timeline_qs, many=True).data

        payload = {
            "week_start": week_start,
            "week_end": week_end,
            "graph": graph,
            "timeline": timeline,
        }

        serializer = WeekSummarySerializer(data=payload)

        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

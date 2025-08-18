# insights/views.py
from datetime import timedelta
from django.utils import timezone
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response

from notes.models import Note
from notes.serializers import NoteInsightSerializer
from .serializers import WeekSummarySerializer, InsightTipSerializer
from .rules import day_points_from_notes, render_tip

# Map category → graph value (1..5) for the history graph
CATEGORY_VALUE_MAP = {
    "very negative": 1,
    "negative": 2,
    "neutral": 3,
    "positive": 4,
    "very positive": 5,
}

# ---- Shared helpers ---------------------------------------------------------

def _parse_week_offset(request) -> int:
    """
    Accept both ?week_offset=<int> and ?week=<int> (alias).
    Negative or invalid values become 0.
    """
    raw = request.query_params.get("week_offset", request.query_params.get("week", "0"))
    try:
        val = int(raw)
        return val if val >= 0 else 0
    except (TypeError, ValueError):
        return 0


def _get_week_range(week_offset: int):
    """
    Monday-anchored 7-day window in local TZ.
    Returns (week_start_date, week_end_date).
    """
    today = timezone.localdate()
    current_week_start = today - timedelta(days=today.weekday())  # Monday
    target_week_start = current_week_start - timedelta(weeks=week_offset)
    target_week_end = target_week_start + timedelta(days=6)
    return target_week_start, target_week_end


# ---- Views ------------------------------------------------------------------

@method_decorator(cache_page(60 * 5), name="dispatch")  # cache for 5 minutes
class WeeklyInsightView(APIView):
    """
    GET /api/v1/insights/history/?week_offset=0

    Returns:
      - graph: 7 points (Mon..Sun) where each point is the latest note's mood_value for that day (or null)
      - timeline: list of notes in the week (newest first)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        week_offset = _parse_week_offset(request)
        week_start, week_end = _get_week_range(week_offset)

        notes = (
            Note.objects.filter(
                user=request.user,
                created_at__date__range=[week_start, week_end],
            )
            .select_related("mood")
            .order_by("created_at")
        )

        # For each day, pick the latest note's mood value
        day_mood_map = {}
        for note in notes:
            note_date = note.created_at.date()
            mood_value = (
                CATEGORY_VALUE_MAP.get(note.mood.category, None) if note.mood else None
            )
            day_mood_map[note_date] = mood_value  # latest wins due to .order_by("created_at")

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


@method_decorator(cache_page(60 * 5), name="dispatch")  # cache for 5 minutes
class WeeklyTipView(APIView):
    """
    GET /api/v1/insights/tip/?week_offset=0
    Returns a single rule-based tip: { "type": "tip", "message": "..." }
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        week_offset = _parse_week_offset(request)
        week_start, week_end = _get_week_range(week_offset)

        notes = (
            Note.objects.filter(
                user=request.user,
                created_at__date__range=[week_start, week_end],
            )
            .select_related("mood")
            .order_by("created_at")
        )

        # Convert to per-day "worst" mood, then render a deterministic tip
        points = day_points_from_notes(notes)
        tip = render_tip(points, week_start)

        ser = InsightTipSerializer(data=tip)
        ser.is_valid(raise_exception=True)
        return Response(ser.validated_data, status=200)

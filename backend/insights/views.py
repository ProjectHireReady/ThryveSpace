# insights/views.py
from datetime import timedelta

from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from notes.models import Note
from .serializers import InsightTipSerializer
from .rules import day_points_from_notes, render_tip
from .services import get_history_payload


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

class InsightsHistoryView(APIView):
    """
    GET /api/v1/insights/history?week_offset=N
    (Also accepts ?week=N as an alias)

    Returns a payload built by services.get_history_payload(user, week_offset):
    {
      "week": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"},
      "graph": [ { "date": "YYYY-MM-DD", "mood_value": 1..5|null, "mood_id": int|null }, ... 7 items ],
      "timeline": [ { "date": "YYYY-MM-DD", "mood_value": 1..5, "mood_id": int|null, "snippet": "..." }, ... ]
    }
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Support both ?week_offset and ?week
        raw = request.query_params.get("week_offset", request.query_params.get("week", "0"))
        try:
            week_offset = int(raw)
            if week_offset < 0:
                return Response(
                    {"detail": "week_offset must be >= 0"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except ValueError:
            return Response(
                {"detail": "week_offset must be an integer"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload = get_history_payload(request.user, week_offset)
        return Response(payload, status=status.HTTP_200_OK)


@method_decorator(cache_page(60 * 5), name="dispatch")  # cache for 5 minutes
class WeeklyTipView(APIView):
    """
    GET /api/v1/insights/tip/?week_offset=0
    Returns a single rule-based tip: { "type": "tip", "message": "..." }
    """
    permission_classes = [IsAuthenticated]

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

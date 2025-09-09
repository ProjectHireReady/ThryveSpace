# insights/views.py
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.conf import settings
from django_rq import get_queue
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from notes.models import Note


from .serializers import InsightTipSerializer
from .rules import day_points_from_notes, render_tip
from .utils import (
    increment_count,
    today_key_suffix,
    get_week_range,
    get_daily_limit,
)
from .jobs import generate_note_feedback, process_user_insights
from .constants import CATEGORY_VALUE_MAP
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

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Support both ?week_offset and ?week
        raw = request.query_params.get(
            "week_offset", request.query_params.get("week", "0")
        )
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

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        week_offset = _parse_week_offset(request)
        week_start, week_end = get_week_range(week_offset)

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


class GuestEncourageView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        note = request.data.get("note", "").strip()
        fingerprint = request.data.get("fingerprint", "").strip()

        if not note or not fingerprint:
            return Response(
                {"error": "Note and fingerprint are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Rate limiting based on fingerprint and daily limit
        key = f"guest:{fingerprint}:{today_key_suffix()}"
        count = increment_count(key, ttl=get_daily_limit())  # 24 hours TTL

        if count > settings.GUEST_RATE_LIMIT_MAX:
            return Response(
                {"error": "Rate limit exceeded. Please try again later."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        response = generate_note_feedback(note_id=None, user=None, note_text=note)

        return Response(
            {"message": response, "today_count": count}, status=status.HTTP_200_OK
        )


class AiFeedbackView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Enqueue AI feedback job for a specific note
        """
        note_id = request.data.get("note_id")
        if not note_id:
            return Response(
                {"error": "note_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            note = Note.objects.get(id=note_id, user=request.user)
        except Note.DoesNotExist:
            return Response(
                {"error": "Note not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        key = f"ai_feedback:{request.user.id}:{today_key_suffix()}"
        count = increment_count(key, ttl=get_daily_limit())  # 24 hours TTL

        if count > settings.MAX_DAILY_AI_LOGGED_IN:
            return Response(
                {"error": "AI daily limit exceeded. Please try again later."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        response = generate_note_feedback(
            note_id=note.id, user=request.user, note_text=note.note
        )

        return Response(
            {"message": response, "today_count": count}, status=status.HTTP_200_OK
        )


class AiSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Enqueue AI analysis job
        """
        week_offset = int(request.data.get("week_offset", 0))
        queue = get_queue("default")
        job = queue.enqueue(process_user_insights, request.user, week_offset)
        return Response(
            {"job_id": job.id, "job_status": job.get_status()},
            status=status.HTTP_202_ACCEPTED,
        )

    def get(self, request):
        """
        Check job status
        """
        job_id = request.query_params.get("job_id", "").strip()
        if not job_id:
            return Response(
                {"error": "job_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queue = get_queue("default")
        job = queue.fetch_job(job_id)
        if not job:
            return Response(
                {"error": "Job not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if job.is_failed:
            return Response(
                {"error": "Job failed.", "details": str(job.exc_info)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if job.is_finished:
            return Response(
                {"message": "Job completed.", "result": job.result},
                status=status.HTTP_200_OK,
            )

        return Response({"job_id": job.id, "job_status": job.get_status()}, status=200)

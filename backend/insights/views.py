# insights/views.py
from django.conf import settings
from django.core.cache import cache
from django_rq import get_queue
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notes.models import Note

from .serializers import InsightTipSerializer
from .rules import render_tip
from .utils import (
    increment_count,
    today_key_suffix,
    get_daily_limit,
)
from .jobs import generate_note_feedback, process_user_insights
from .services import (
    parse_week_offset,
    get_week_range,
    get_week_points,
    get_history_payload,
    cache_key_for,
    WEEK_CACHE_TTL,
)

# ----------------------------------------------------------------------
# History
# ----------------------------------------------------------------------

class InsightsHistoryView(APIView):
    """
    GET /api/v1/insights/history?week_offset=N
    (Also accepts ?week=N as an alias)

    Returns payload from services.get_history_payload(user, week_offset):
    {
      "week": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"},
      "graph": [ { "date": "YYYY-MM-DD", "mood_value": 1..5|null, "mood_id": int|null }, ... 7 items ],
      "timeline": [ { "date": "YYYY-MM-DD", "mood_value": 1..5, "mood_id": int|null, "snippet": "..." }, ... ]
    }
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            week_offset = parse_week_offset(request, allow_negative=False)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Shared week-payload cache under the "history" key (intentional)
        payload = get_history_payload(request.user, week_offset)
        return Response(payload, status=status.HTTP_200_OK)


# ----------------------------------------------------------------------
# Tip (rule-based)
# ----------------------------------------------------------------------

class WeeklyTipView(APIView):
    """
    GET /api/v1/insights/tip?week_offset=N

    Returns a single rule-based tip:
      { "type": "tip", "message": "..." }

    Uses the same week window & reduction as /history (centralized helpers).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Optional feature flag
        if not getattr(settings, "INSIGHTS_TIP_ENABLED", True):
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            week_offset = parse_week_offset(request, allow_negative=False)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        wr = get_week_range(week_offset)

        # Tip-specific response cache (separate from history cache)
        tip_cache_key = cache_key_for("tip", request.user.id, wr)
        cached = cache.get(tip_cache_key)
        if cached is not None:
            return Response(cached, status=status.HTTP_200_OK)

        # Same reducer as history (already cached under history)
        points = get_week_points(request.user, week_offset)  # [(date_iso, mood_value|None), ...]

        tip = render_tip(points, wr.start)
        ser = InsightTipSerializer(data=tip)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        cache.set(tip_cache_key, data, timeout=WEEK_CACHE_TTL)
        return Response(data, status=status.HTTP_200_OK)


# ----------------------------------------------------------------------
# Guest encourage (Frank’s original)
# ----------------------------------------------------------------------

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


# ----------------------------------------------------------------------
# AI feedback (Frank’s original)
# ----------------------------------------------------------------------

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


# ----------------------------------------------------------------------
# AI summary (Frank’s original)
# ----------------------------------------------------------------------

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

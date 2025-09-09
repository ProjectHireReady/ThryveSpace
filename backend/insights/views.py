# insights/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.cache import cache
from django.conf import settings

from .serializers import InsightTipSerializer
from .rules import render_tip
from .services import (
    parse_week_offset,
    get_week_range,
    get_week_points,
    get_history_payload,
    cache_key_for,
    WEEK_CACHE_TTL,
)


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
            # Past/current only
            week_offset = parse_week_offset(request, allow_negative=False)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Shared week-payload cache under "history" key (intentional)
        payload = get_history_payload(request.user, week_offset)
        return Response(payload, status=status.HTTP_200_OK)


class WeeklyTipView(APIView):
    """
    GET /api/v1/insights/tip?week_offset=N
    Returns a single rule-based tip: { "type": "tip", "message": "..." }
    Uses the same week window & reduction as /history via centralized helpers.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Optional feature flag
        if not getattr(settings, "INSIGHTS_TIP_ENABLED", True):
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            # Past/current only for tips
            week_offset = parse_week_offset(request, allow_negative=False)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        wr = get_week_range(week_offset)

        # Tip-specific response cache (separate from history cache)
        tip_cache_key = cache_key_for("tip", request.user.id, wr)
        if (cached := cache.get(tip_cache_key)) is not None:
            return Response(cached, status=status.HTTP_200_OK)

        # Reuse shared week payload via points (graph reducer already cached by history)
        points = get_week_points(request.user, week_offset)  # [(date_iso, mood_value|None), ...]

        # Render deterministic tip from weekly points
        tip = render_tip(points, wr.start)

        ser = InsightTipSerializer(data=tip)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        cache.set(tip_cache_key, data, timeout=WEEK_CACHE_TTL)
        return Response(data, status=status.HTTP_200_OK)


class WeeklyPredictionView(APIView):
    """
    OPTIONAL: GET /api/v1/insights/prediction?week_offset=N
    Allows future weeks (negative offsets), reuses same reduction as history.
    Example response shape (adjust to your serializer/rules):
      { "type": "prediction", "message": "...", "confidence": 0.72 }
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Optional feature flag
        if not getattr(settings, "INSIGHTS_PREDICTION_ENABLED", True):
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            # Allow future weeks for predictions
            week_offset = parse_week_offset(request, allow_negative=True)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        wr = get_week_range(week_offset)

        # Prediction-specific response cache
        pred_cache_key = cache_key_for("prediction", request.user.id, wr)
        if (cached := cache.get(pred_cache_key)) is not None:
            return Response(cached, status=status.HTTP_200_OK)

        # Points will be all None for future weeks (no notes), which your predictor can handle
        points = get_week_points(request.user, week_offset)

        # TODO: plug in your prediction logic here
        payload = {
            "type": "prediction",
            "message": "Prediction stub — plug in model/heuristics.",
            "confidence": 0.0,
        }

        cache.set(pred_cache_key, payload, timeout=WEEK_CACHE_TTL)
        return Response(payload, status=status.HTTP_200_OK)

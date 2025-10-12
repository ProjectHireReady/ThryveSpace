from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Max
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.http import condition  # <--- NEW IMPORT: for ETag handling
from .models import Mood, MoodCategory
from .serializers import MoodsCategoriesSerializer
import hashlib
from datetime import datetime

# --- ETag Generation Logic (Reusable) ---


def get_last_modified(request, *args, **kwargs):
    """Returns the most recent updated_at timestamp across Mood and MoodCategory."""

    # Check max updated_at for active Moods
    latest_mood = Mood.objects.filter(is_active=True).aggregate(
        max_updated=Max("updated_at")
    )["max_updated"]

    # Check max updated_at for all MoodCategories (since they affect the final data structure)
    latest_category = MoodCategory.objects.all().aggregate(
        max_updated=Max("updated_at")
    )["max_updated"]

    # Return the later of the two, or now if no objects exist (safe fallback)

    # Use timezone-aware minimum datetime
    min_dt = datetime.min.replace(tzinfo=timezone.get_current_timezone())
    last_modified = max(
        latest_mood if latest_mood else min_dt,
        latest_category if latest_category else min_dt,
    )

    # @condition requires returning a datetime object or None
    # If both are None, last_modified == min_dt, so return None to indicate no real data
    return last_modified if last_modified != min_dt else None


def calculate_moods_etag(request, *args, **kwargs):
    """
    Generates a unique ETag based on the latest update timestamp.
    NOTE: We rely primarily on the timestamp returned by get_last_modified.
    If further hashing is needed for content, the 'last modified' timestamp
    is a good hash component.
    """
    last_modified = get_last_modified(request)

    # Using the ISO format of the latest timestamp is a simple, effective ETag generator
    if last_modified:
        content_to_hash = last_modified.isoformat()
        return hashlib.sha1(content_to_hash.encode("utf-8")).hexdigest()
    return None  # No ETag if no data exists


# Apply conditional GET logic (ETag and Last-Modified)
@method_decorator(
    condition(etag_func=calculate_moods_etag, last_modified_func=get_last_modified),
    name="get",
)
class MoodsAPIView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ["get", "head", "options"]

    def get(self, request, *args, **kwargs):
        # The @condition decorator handles the 304 check BEFORE this method is called.
        # If the ETag matches, Django returns 304, and this code is skipped.

        # 1. Fetch all active moods
        all_moods = Mood.objects.filter(is_active=True).select_related("category")

        # 2. Serialize the data structure
        serializer = MoodsCategoriesSerializer(all_moods)
        final_data = serializer.data

        # 3. Build and return the successful 200 response
        # The ETag and Last-Modified headers are added automatically by @condition.
        response = Response(final_data, status=status.HTTP_200_OK)

        # Manually add the Cache-Control header for client-side caching
        response["Cache-Control"] = "public, max-age=86400, must-revalidate"

        return response

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Max
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Mood, MoodCategory
from .serializers import MoodsCategoriesSerializer
import json
import hashlib

# --- ETag Generation Logic (Reusable) ---

def generate_etag(data):
    """
    Generates a unique ETag based on the response content and the latest update timestamp.
    """
    # Find the latest update time across all active Moods
    try:
        latest_update = Mood.objects.filter(is_active=True).aggregate(max_updated=Max('updated_at'))['max_updated']
    except AttributeError:
        # Handle case where no moods exist
        latest_update = '0'

    data_string = json.dumps(data, sort_keys=True, default=str)
    content_to_hash = f"{data_string}_{latest_update}"
    
    return hashlib.sha1(content_to_hash.encode('utf-8')).hexdigest()

# Apply daily caching (86400 seconds = 24 hours)
@method_decorator(cache_page(86400), name='get')
class MoodsAPIView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ['get', 'head', 'options']

    def get(self, request, *args, **kwargs):
        # 1. Fetch all active moods (needed for data and ETag)
        all_moods = Mood.objects.filter(is_active=True).select_related('category')
        
        # 2. Serialize the data structure
        # NOTE: We pass the queryset to the serializer instance for access in get_moods.
        serializer = MoodsCategoriesSerializer(all_moods) 
        final_data = serializer.data
        
        # 3. Generate ETag and check for 304 response
        etag = generate_etag(final_data)
        client_etag = request.headers.get('If-None-Match')
        
        if client_etag == f'"{etag}"':
            return HttpResponse(status=status.HTTP_304_NOT_MODIFIED)

        # 4. Build and return the successful 200 response
        response = Response(final_data, status=status.HTTP_200_OK)
        response['ETag'] = f'"{etag}"'
        response['Cache-Control'] = 'public, max-age=86400, must-revalidate'

        return response
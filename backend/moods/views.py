from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Max
from .models import Mood, CATEGORY_CHOICES
from .serializers import MoodsCategoriesSerializer

class MoodsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        # 1. Generate a unique ETag based on the latest update to any mood.
        last_updated = Mood.objects.aggregate(max_updated=Max('updated_at'))['max_updated']
        etag_value = f'"{last_updated.timestamp()}"' if last_updated else '""'

        # 2. Check if the client sent an If-None-Match header that matches our ETag.
        if_none_match = request.headers.get('If-None-Match')
        if if_none_match == etag_value:
            # Data is unchanged. Return a 304 response.
            return Response(status=status.HTTP_304_NOT_MODIFIED)

        # 3. If data is new or ETag doesn't match, fetch and serialize all active moods.
        all_moods = Mood.objects.filter(is_active=True)
        serializer = MoodsCategoriesSerializer(all_moods)
        
        # 4. Build and return the successful 200 response with ETag and Cache-Control headers.
        response = Response(serializer.data, status=status.HTTP_200_OK)
        response['ETag'] = etag_value
        response['Cache-Control'] = 'public, max-age=86400, must-revalidate'

        return response

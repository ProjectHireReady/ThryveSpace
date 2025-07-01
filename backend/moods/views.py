from rest_framework import generics, permissions
from .models import Mood
from .serializers import MoodSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page


class MoodListView(generics.ListAPIView):
    """
    API view to retrieve a list of all moods.
    """

    queryset = Mood.objects.filter(is_active=True)
    serializer_class = MoodSerializer
    permission_classes = [permissions.AllowAny]

    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

# backend/notes/views.py
# Remove these imports if they are only for save_note function:
# import json
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.shortcuts import get_object_or_404
# from django.contrib.auth import get_user_model

# Import DRF generics, our models and serializers
from rest_framework import generics # For ListCreateAPIView
from rest_framework.permissions import AllowAny #temporary
from .models import Note
from .serializers import NoteSerializer # Import your new NoteSerializer

# Remove the Mood import if Mood is only used within NoteSerializer's create method
# from moods.models import Mood

class NoteListCreateAPIView(generics.ListCreateAPIView):
    """
    GET  /api/notes/   → List the authenticated user’s notes (newest first)
    POST /api/notes/   → Create a journal entry linked to a mood (optional)
    """
    serializer_class = NoteSerializer
    permission_classes = [AllowAny]   # allow anonymous calls

    def get_queryset(self):
        """
        • During prototyping we return ALL notes so you can see what you create.
        • Once auth is ready, switch to `request.user` filter.
        """
        return Note.objects.all().order_by('-created_at')

    # Optional (if you want to set user automatically on POST)
    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user) # Example if user is authenticated
 

    # No need for a separate 'create' method here unless you have custom logic
    # beyond what the serializer's create method handles.
    # The serializer's create() method will be called automatically on POST.

# Note: The legacy `save_note` function is no longer needed—
# its functionality is now covered by the serializer and ListCreateAPIView.

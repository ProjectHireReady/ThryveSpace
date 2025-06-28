# backend/notes/views.py
# Remove these imports if they are only for save_note function:
# import json
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.shortcuts import get_object_or_404
# from django.contrib.auth import get_user_model

# Import DRF generics and APIView, and your models and serializers
from rest_framework import generics # For ListCreateAPIView
from rest_framework.views import APIView # If you want to use this instead of generics
from rest_framework.response import Response # For custom responses
from rest_framework import status # For HTTP status codes

from .models import Note
from .serializers import NoteSerializer # Import your new NoteSerializer

# Remove the Mood import if Mood is only used within NoteSerializer's create method
# from moods.models import Mood

class NoteListCreateAPIView(generics.ListCreateAPIView):
    # For GET requests (listing notes)
    queryset = Note.objects.all().order_by('-created_at') # Order by most recent
    serializer_class = NoteSerializer


    # No need for a separate 'create' method here unless you have custom logic
    # beyond what the serializer's create method handles.
    # The serializer's create() method will be called automatically on POST.
    # You might want to override perform_create to set the user if you are using authentication
    # def perform_create(self, serializer):
    #    serializer.save(user=self.request.user) # Example if user is authenticated

# Remove the old @csrf_exempt def save_note(request): function entirely.
# Its logic is now handled by NoteSerializer.create() and ListCreateAPIView's default POST behavior.


# backend/notes/views.py

# Import DRF generics and APIView, and your models and serializers
from rest_framework import generics  # For ListCreateAPIView
from rest_framework.views import APIView  # If you want to use this instead of generics
from rest_framework.response import Response  # For custom responses
from rest_framework import status  # For HTTP status codes
from rest_framework.permissions import IsAuthenticated

from .models import Note
from .serializers import NoteSerializer  # Import your new NoteSerializer

# Remove the Mood import if Mood is only used within NoteSerializer's create method
# from moods.models import Mood


class NoteListCreateAPIView(generics.ListCreateAPIView):
    # For GET requests (listing notes)
    serializer_class = NoteSerializer
    permission_classes = [
        IsAuthenticated
    ]  # Ensure only authenticated users can access this view

    def get_queryset(self):
        """This method returns the queryset of notes for the authenticated user."""
        print(f"User: {self.request.user}")
        print(f"session_key: {self.request.session.session_key}")
        if not self.request.user.is_authenticated:
            return Note.objects.none()
        return Note.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        """This method is called when a POST request is made to create a new note."""
        if not self.request.user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        serializer.save(user=self.request.user)

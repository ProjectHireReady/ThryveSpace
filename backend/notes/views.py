# backend/notes/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from .models import Note
from .serializers import (
    NoteSerializer,
    NoteCreateSerializer,
    NoteMigrationSerializer,
)
from moods.models import Mood

class NoteListCreateAPIView(generics.ListCreateAPIView):
    """
    Handles GET (list all notes for a user) and POST (create a new note).
    """
    serializer_class = NoteCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).order_by("-created_at")

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return NoteCreateSerializer
        return NoteSerializer

    def perform_create(self, serializer):
        user = self.request.user
        mood_name = self.request.data.get('mood_name')

        mood_obj = None
        if mood_name:
            try:
                mood_obj = Mood.objects.get(name__iexact=mood_name)
            except Mood.DoesNotExist:
                raise ValidationError({'mood_name': f"Mood '{mood_name}' not found."})
        
        serializer.save(user=user, mood=mood_obj)

class NoteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles GET, PUT, PATCH, and DELETE for a single note.
    """
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

class NoteMigrationAPIView(APIView):
    """
    Handles bulk saving of guest notes during user signup.
    """
    serializer_class = NoteMigrationSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        validated_entries = serializer.validated_data['entries']
        
        success_count = 0
        errors = []

        for entry_data in validated_entries:
            try:
                mood_name = entry_data.pop('mood_name', None)
                mood_obj = None
                if mood_name:
                    mood_obj = Mood.objects.get(name__iexact=mood_name)
                
                Note.objects.create(user=user, mood=mood_obj, **entry_data)
                success_count += 1
            except Mood.DoesNotExist:
                errors.append(f"Mood '{mood_name}' not found for entry '{entry_data.get('note')}'.")
            except Exception as e:
                errors.append(f"Error saving entry '{entry_data.get('note')}': {str(e)}")

        response_data = {
            "message": f"Migration complete. {success_count} entries saved.",
            "success_count": success_count,
            "errors": errors,
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
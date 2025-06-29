# backend/notes/views.py

from rest_framework import generics  # For ListCreateAPIView
from rest_framework.response import Response  # For custom responses
from rest_framework import status  # For HTTP status codes

from .models import Note
from .serializers import NoteSerializer  # Import your NoteSerializer

# This view handles both GET (list notes) and POST (create note)
class NoteListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer

    def get_queryset(self):
        """
        Optionally filters notes by guest_uuid (user.id),
        returns all notes ordered by most recent by default.
        """
        guest_uuid = self.request.query_params.get('guest_uuid')
        queryset = Note.objects.all().order_by('-created_at')
        if guest_uuid:
            queryset = queryset.filter(user__id=guest_uuid)
        return queryset

  

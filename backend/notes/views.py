from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Note
from .serializers import NoteSerializer
from .permissions import IsOwner
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly # Added IsAuthenticatedOrReadOnly
from rest_framework import serializers # Good for ValidationError
from .permissions import IsOwner # Only import IsOwner
from .models import Note
feature-backend/api-guest-filtering-22
from .serializers import NoteSerializer  # Import your NoteSerializer

# This view handles both GET (list notes) and POST (create note)
class NoteListCreateAPIView(generics.ListCreateAPIView):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class NoteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    lookup_field = 'pk'

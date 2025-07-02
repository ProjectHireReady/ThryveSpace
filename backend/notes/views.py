from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Note
from .serializers import NoteSerializer
from .permissions import IsOwner

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
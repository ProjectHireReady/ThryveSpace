# backend/notes/views.py
feature-backend/api-guest-filtering-22

from rest_framework import generics  # For ListCreateAPIView
from rest_framework.response import Response  # For custom responses
from rest_framework import status  # For HTTP status codes



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

    serializer_class = NoteSerializer
    # Corrected permission class name
    permission_classes = [IsAuthenticated, IsOwner]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Create a mutable copy of request.data for processing
        data = request.data.copy()

        # Custom logic for mood_name during update
        mood_name = data.get('mood_name')
        if mood_name is not None: # Check if mood_name was provided in the request payload
            if mood_name: # If provided and not empty, find the mood object
                try:
                    mood_obj = Mood.objects.get(name__iexact=mood_name)
                    # Set the 'mood' field in the data to the Mood object's ID
                    # This is what the serializer expects for the ForeignKey
                    data['mood'] = str(mood_obj.id)
                except Mood.DoesNotExist:
                    return Response({'mood_name': f"Mood '{mood_name}' not found."},
                                    status=status.HTTP_400_BAD_REQUEST)
            else: # If mood_name was provided but empty, set mood to null
                data['mood'] = None
        
        # Remove mood_name from the data *before* passing to serializer,
        # as it's a write_only field for custom logic, not a model field.
        if 'mood_name' in data:
            data.pop('mood_name')

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True) # Validate the data
feature-backend/api-guest-filtering-22
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


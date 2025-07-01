# backend/notes/views.py
feature-backend/notes-edit-delete


from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly # Added IsAuthenticatedOrReadOnly
from rest_framework import serializers # Good for ValidationError
from .permissions import IsOwner # Only import IsOwner
from .models import Note
from .serializers import NoteSerializer
feature-backend/notes-edit-delete



# --- This is for list and create ---
class NoteListCreateAPIView(generics.ListCreateAPIView):
feature-backend/notes-edit-delete
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    # Changed to DRF's standard permission for this behavior
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        user_id_str = self.request.data.get('user_id')
        mood_name = self.request.data.get('mood_name')
        note_content = self.request.data.get('note', '')

        if not user_id_str:
            raise serializers.ValidationError({'user_id': 'user_id is required.'})

        try:
            user_obj = CustomUser.objects.get(id=user_id_str)
        except (CustomUser.DoesNotExist, ValueError):
            raise serializers.ValidationError({'user_id': 'Invalid or non-existent user_id.'})

        mood_obj = None
        if mood_name:
            try:
                mood_obj = Mood.objects.get(name__iexact=mood_name)
            except Mood.DoesNotExist:
                raise serializers.ValidationError({'mood_name': f"Mood '{mood_name}' not found."})

        # Save the note with the determined user, mood, and content
        serializer.save(user=user_obj, mood=mood_obj, note=note_content)


# --- This is for Retrieve, Update, Delete ---
class NoteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
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

        self.perform_update(serializer) # Perform the actual update on the instance

        # If you were prefetching related objects, you might need to refresh
        # the instance from the DB to get updated nested fields.
        # Otherwise, the serializer.instance after perform_update is usually fine.
        # In this case, let's re-serialize the instance for consistent output.
        return Response(self.get_serializer(instance).data)

    # perform_destroy is usually handled fine by the default RetrieveUpdateDestroyAPIView
    # You only need to override it if you have custom logic for deletion (e.g., logging)
    # def perform_destroy(self, instance):
    #     instance.delete()


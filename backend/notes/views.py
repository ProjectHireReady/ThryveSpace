from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from django.db import transaction
from config.permissions import IsOwner
from .models import Note
from .serializers import (
    NoteSerializer,
    NoteCreateSerializer,
    NoteMigrationSerializer,
    NoteLeanSerializer,  # Import lean serializer
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
        if self.request.method == "POST":
            return NoteCreateSerializer
        return NoteSerializer

    def perform_create(self, serializer):
        user = self.request.user
        mood_name = self.request.data.get("mood_name")

        mood_obj = None
        if mood_name:
            try:
                mood_obj = Mood.objects.get(name__iexact=mood_name)
            except Mood.DoesNotExist:
                raise ValidationError({"mood_name": f"Mood '{mood_name}' not found."})

        mood_value_snapshot = mood_obj.category_value if mood_obj else None
        serializer.save(user=user, mood=mood_obj, mood_value_snapshot=mood_value_snapshot)


    def create(self, request, *args, **kwargs):
        """
        Override to return a lean response using NoteLeanSerializer.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        note = serializer.instance
        read_data = NoteLeanSerializer(note, context={"request": request}).data
        return Response(read_data, status=status.HTTP_201_CREATED)


class NoteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles GET, PUT, PATCH, and DELETE for a single note.
    """

    serializer_class = NoteSerializer
    permission_classes = [IsOwner]
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(user=user)

    def update(self, request, *args, **kwargs):
        """
        Override to return a lean response using NoteLeanSerializer.
        """
        response = super().update(request, *args, **kwargs)
        note = self.get_object()
        data = NoteLeanSerializer(note, context={"request": request}).data
        return Response(data, status=response.status_code)


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
        validated_entries = serializer.validated_data["entries"]
        notes_to_create = []
        errors = []

        try:
            for entry_data in validated_entries:
                try:
                    mood_id = entry_data.get("mood_id")
                    mood = Mood.objects.get(id=mood_id)

                    notes_to_create.append(
                        Note(
                            note=entry_data["note"],
                            mood=mood,
                            user=user,
                            created_at=entry_data.get("created_at"),
                            mood_value_snapshot=mood.category_value,
                        )
                    )
                except Mood.DoesNotExist:
                    errors.append(
                        f"Mood with ID '{mood_id}' not found for note '{entry_data.get('note')}'."
                    )
                except Exception as e:
                    errors.append(
                        f"Error preparing entry '{entry_data.get('note')}': {str(e)}"
                    )

            if errors:
                return Response(
                    {
                        "message": "Validation failed for some entries.",
                        "success_count": 0,
                        "errors": errors,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with transaction.atomic():
                created_notes = Note.objects.bulk_create(notes_to_create)

            # Serialize using lean serializer
            serialized_notes = [NoteLeanSerializer(note).data for note in created_notes]

            return Response(
                {
                    "message": f"Migration complete. {len(serialized_notes)} entries saved.",
                    "success_count": len(serialized_notes),
                    "notes": serialized_notes,
                    "errors": [],
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": f"An error occurred during migration: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

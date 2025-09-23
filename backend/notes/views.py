from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from insights.utils import increment_count
from django.conf import settings
from django.db import transaction
from config.permissions import IsOwner
from .models import Note
from .serializers import (
    NoteSerializer,
    NoteCreateSerializer,
    NoteMigrationSerializer,
    NoteLeanSerializer,
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

    def create(self, request, *args, **kwargs):
        """
        Override to return a lean response using NoteLeanSerializer.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        note = serializer.instance

        key = f"user_note_count:{self.request.user.id}"
        note_count = increment_count(
            key
        )  # TTL (24 hours) is configured in increment_count
        read_data = NoteLeanSerializer(note, context={"request": request}).data

        # Indicate that a milestone message should be shown
        if note_count in settings.MILESTONE_TRIGGERS:
            read_data["is_milestone"] = True
        else:
            read_data["is_milestone"] = False

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

        # Step 1: Prepare notes for bulk creation, resolving mood_name to Mood instance
        for entry_data in validated_entries:
            try:
                mood_obj = None
                mood_value_snapshot = None
                mood_name = entry_data.get("mood_name")
                if mood_name:
                    mood_obj = Mood.objects.get(name__iexact=mood_name)
                    # Get the integer value from the mood object
                    if mood_obj is not None:
                        mood_value_snapshot = mood_obj.category

                notes_to_create.append(
                    Note(
                        note=entry_data["note"],
                        mood=mood_obj,
                        user=user,
                        created_at=entry_data.get("created_at"),
                        mood_value_snapshot=mood_value_snapshot,
                    )
                )
            except Mood.DoesNotExist:
                errors.append(
                    f"Mood '{mood_name}' not found for note '{entry_data.get('note')}'."
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

        try:
            with transaction.atomic():
                Note.objects.bulk_create(notes_to_create)

            created_notes = Note.objects.filter(user=user).order_by("-created_at")[
                : len(notes_to_create)
            ]
            notes_data = NoteLeanSerializer(created_notes, many=True).data

            return Response(
                {
                    "message": f"Migration complete. {len(notes_to_create)} entries saved.",
                    "success_count": len(notes_to_create),
                    "errors": [],
                    "notes": notes_data,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": f"An error occurred during migration: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

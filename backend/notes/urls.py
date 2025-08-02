# backend/notes/urls.py
from django.urls import path
from .views import NoteListCreateAPIView, NoteDetailAPIView  # Import the new view

urlpatterns = [
    path("", NoteListCreateAPIView.as_view(), name="note-list-create"),
    path(
        "<uuid:id>/", NoteDetailAPIView.as_view(), name="note-detail"
    ),  # New URL pattern
]

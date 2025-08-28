# backend/notes/urls.py

from django.urls import path
from .views import NoteListCreateAPIView, NoteDetailAPIView, NoteMigrationAPIView

urlpatterns = [
    # The 'notes/' prefix is now handled by config/urls.py, so we remove it here.
    path("", NoteListCreateAPIView.as_view(), name="note-list-create"),
    path("<uuid:pk>/", NoteDetailAPIView.as_view(), name="note-detail"),
    path("migrate/", NoteMigrationAPIView.as_view(), name="note-migrate"),
]
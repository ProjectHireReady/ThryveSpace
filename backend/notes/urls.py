# backend/notes/urls.py
from django.urls import path
from .views import NoteListCreateAPIView # Import your new class-based view

urlpatterns = [
    # This single path now handles both GET (list notes) and POST (create note)

    path('', NoteListCreateAPIView.as_view(), name='note-list-create'),
]

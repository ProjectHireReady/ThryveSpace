from django.urls import path
feature-backend/notes-edit-delete
from .views import NoteListCreateAPIView, NoteDetailAPIView

urlpatterns = [
    path('', NoteListCreateAPIView.as_view(), name='note-list-create'),
    path('<uuid:pk>/', NoteDetailAPIView.as_view(), name='note-detail'),
]


# moodjournal/notes/urls.py
from django.urls import path
from .views import save_note

urlpatterns = [
    path('', save_note), # This will map to /api/notes/
]
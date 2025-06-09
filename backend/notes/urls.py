# backend/notes/urls.py
from django.urls import path
from .views import save_note # This assumes save_note is a function-based view

urlpatterns = [
    path('', save_note, name='save_note'),
]
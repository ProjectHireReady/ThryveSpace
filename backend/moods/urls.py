# backend/moods/urls.py
from django.urls import path
from .views import MoodListView # Corrected import

urlpatterns = [
    path('', MoodListView.as_view(), name='moods_list'),
]
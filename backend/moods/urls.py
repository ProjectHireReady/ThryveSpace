from django.urls import path
from .views import MoodListView

urlpatterns = [
    path("", MoodListView.as_view(), name="mood-list"),
]
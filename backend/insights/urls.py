from django.urls import path
from .views import WeeklyInsightView

urlpatterns = [
    path("history/", WeeklyInsightView.as_view(), name="mood_history"),
]

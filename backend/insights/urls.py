from django.urls import path
from .views import WeeklyInsightView, WeeklyTipView

urlpatterns = [
    path("history/", WeeklyInsightView.as_view(), name="mood_history"),
     path("tip/", WeeklyTipView.as_view(), name="mood_tip"),
]

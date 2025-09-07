# insights/urls.py
from django.urls import path
from .views import WeeklyTipView, InsightsHistoryView

urlpatterns = [
    path("history/", InsightsHistoryView.as_view(), name="insights-history"),
    path("tip/", WeeklyTipView.as_view(), name="insights-tip"),
]

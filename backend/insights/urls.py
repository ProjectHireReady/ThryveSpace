# insights/urls.py
from django.urls import path
from .views import WeeklyTipView, InsightsHistoryView

urlpatterns = [
     path("api/v1/insights/tip", WeeklyTipView.as_view(), name="insights-tip"),
    path("api/v1/insights/history", InsightsHistoryView.as_view(), name="insights-history"),
]

# insights/urls.py
from django.urls import path
from .views import WeeklyTipView, InsightsHistoryView, GuestEncourageView, AiSummaryView, AiFeedbackView

urlpatterns = [
    path("history/", InsightsHistoryView.as_view(), name="insights-history"),
    path("ai-feedback/", AiFeedbackView.as_view(), name="ai_feedback"),
    path("guest/encourage/", GuestEncourageView.as_view(), name="guest_encourage"),
    path("ai-messages/", AiSummaryView.as_view(), name="ai_summary"),
    path("tip/", WeeklyTipView.as_view(), name="insights-tip"),
]

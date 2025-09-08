from django.urls import path
from .views import WeeklyInsightView, WeeklyTipView, GuestEncourageView, AiSummaryView, AiFeedbackView

urlpatterns = [
    path("history/", WeeklyInsightView.as_view(), name="mood_history"),
    path("ai-feedback/", AiFeedbackView.as_view(), name="ai_feedback"),
    path("guest/encourage/", GuestEncourageView.as_view(), name="guest_encourage"),
    path("ai-messages/", AiSummaryView.as_view(), name="ai_summary"),
    path("tip/", WeeklyTipView.as_view(), name="mood_tip"),
]

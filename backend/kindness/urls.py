from django.urls import path
from .views import KindnessMessageView

urlpatterns = [
    path('kindness/', KindnessMessageView.as_view(), name='kindness-message'),
]


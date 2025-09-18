from django.urls import path
from .views import MoodsAPIView

urlpatterns = [
    path("", MoodsAPIView.as_view(), name="moods_api"),
]

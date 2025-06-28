from django.urls import path
from .views import GuestCreateView

urlpatterns = [
    path('', GuestCreateView.as_view(), name='create_guest'),
]
from django.urls import path
from .views import (
    LogoutView,
    SignUpView,
    LoginView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="user_login"),
    path("logout/", LogoutView.as_view(), name="user_logout"),
    path("signup/", SignUpView.as_view(), name="user_signup"),
]

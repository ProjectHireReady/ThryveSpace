from django.urls import path
from .views import (
    LogoutView,
    SignUpView,
    LoginView,
    UserMeView
)

urlpatterns = [
    path("me/", UserMeView.as_view(), name="user_me"),
    path("login/", LoginView.as_view(), name="user_login"),
    path("logout/", LogoutView.as_view(), name="user_logout"),
    path("signup/", SignUpView.as_view(), name="user_signup"),
]

from django.urls import path
from .views import (
    GuestCreateView,
    ResetTokenView,
    GuestUpgradeView,
    LoginView,
    LogoutView,
)

urlpatterns = [
    path("", GuestCreateView.as_view(), name="create_guest"),
    path("reset-token/", ResetTokenView.as_view(), name="reset_token"),
    path("upgrade/", GuestUpgradeView.as_view(), name="upgrade_guest"),
    path("login/", LoginView.as_view(), name="user_login"),
    path("logout/", LogoutView.as_view(), name="user_logout"),
]

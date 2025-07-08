from django.urls import path
from .views import (
    GuestCreateView,
    ResetTokenView,
    GuestUpgradeView,
    LogoutView,
)
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("", GuestCreateView.as_view(), name="create_guest"),
    path("reset-token/", ResetTokenView.as_view(), name="reset_token"),
    path("upgrade/", GuestUpgradeView.as_view(), name="upgrade_guest"),
    path("login/", obtain_auth_token, name="user_login"),
    path("logout/", LogoutView.as_view(), name="user_logout"),
]

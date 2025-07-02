# backend/users/urls.py
from django.urls import path
from .views import (
    GuestCreateView,
    ResetTokenView,
    GuestUpgradeView,
    LoginView,
    LogoutView,
    # --- ADD RegisterView TO THE IMPORT LIST ---
    RegisterView, # <--- Make sure this matches the actual class name in views.py
    # --- END ADDITION ---
)

urlpatterns = [
    path("", GuestCreateView.as_view(), name="create_guest"),
    path("reset-token/", ResetTokenView.as_view(), name="reset_token"),
    path("upgrade/", GuestUpgradeView.as_view(), name="upgrade_guest"),
    path("login/", LoginView.as_view(), name="user_login"),
    path("logout/", LogoutView.as_view(), name="user_logout"),
    path("register/", RegisterView.as_view(), name="user_register"),
]
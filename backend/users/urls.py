from django.urls import path
from .views import GuestCreateView, ResetTokenView, GuestUpgradeView

urlpatterns = [
    path("", GuestCreateView.as_view(), name="create_guest"),
    path("reset-token/", ResetTokenView.as_view(), name="reset_token"),
    path("upgrade/", GuestUpgradeView.as_view(), name="upgrade_guest"),
]

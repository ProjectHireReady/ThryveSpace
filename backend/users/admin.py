# backend/users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import (
    UserAdmin as BaseUserAdmin,
)  # Import Django's default UserAdmin
from .models import CustomUser


# Define an Admin class for your CustomUser
class CustomUserAdmin(BaseUserAdmin):
    # The fieldsets control the layout of fields in the admin change form.
    # You'll want to include 'id' here to see the UUID.
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {"fields": ("id",)}),  # Add the 'id' field to a new section
    )
    # The list_display controls which fields are shown in the user list view.
    # You might want to add 'id' here too.
    list_display = (
        "username",
        "email",
        "id",
        "is_staff",
        "is_guest",
        "reset_token",
    )  # Added 'id' to list view

    list_filter = BaseUserAdmin.list_filter + (
        "is_guest",
    )  # Add 'is_guest' to the filter options
    readonly_fields = ("id",)  # Make the ID read-only so it can't be changed


# Register your CustomUser model with your custom admin class
admin.site.register(CustomUser, CustomUserAdmin)

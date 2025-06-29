# backend/users/models.py
import uuid
import string
from django.contrib.auth.models import AbstractUser
from django.utils.crypto import get_random_string
from django.db import models


def generate_reset_token():
    """Generate a random reset token."""
    return get_random_string(length=6, allowed_chars=string.digits)


class CustomUser(AbstractUser):
    """
    Custom User model with guest support and reset token
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    is_guest = models.BooleanField(default=True)
    reset_token = models.CharField(max_length=10, blank=True, null=True, unique=True)

    def save(self, *args, **kwargs):
        # Generate reset_token on save
        if self.is_guest and not self.reset_token:
            self.reset_token = generate_reset_token()
        super().save(*args, **kwargs)

    def __str__(self):
        if self.is_guest:
            return self.id.hex  # Return UUID as string for guest users
        return self.username

# backend/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class CustomUser(AbstractUser):
    # Add a UUID primary key
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Add any additional fields you might want for your users (e.g., phone_number)
    # phone_number = models.CharField(max_length=15, blank=True, null=True)

    # You might also want to set related_name to avoid clashes if you have other models
    # linking to User. The default related_name for Note.user should be fine.

    def __str__(self):
        return self.username
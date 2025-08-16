from django.db import models

# Create your models here.
import uuid
from django.conf import settings

class KindnessMessageLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='kindness_logs')
    message = models.TextField()
    source = models.CharField(max_length=32, default='rule_based')  # or 'ml' in future
    note_ids_used = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['user', 'created_at'])]
        ordering = ['-created_at']

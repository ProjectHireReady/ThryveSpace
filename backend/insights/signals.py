from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from datetime import date, timedelta
from notes.models import Note
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)


def delete_user_week_cache(user_pk: int, week_start: date):
    key = f"insights:history:{str(user_pk)}:{week_start.isoformat()}"
    cache.delete(key)

    logger.debug(
        f"Cleared weekly insights cache for user {user_pk}, week starting {week_start}"
    )


@receiver(post_save, sender=Note)
def clear_cache_on_note_save(sender, instance: Note, **kwargs):
    user_pk = instance.user.pk
    note_date = instance.created_at.date()
    monday = note_date - timedelta(days=note_date.weekday())
    delete_user_week_cache(user_pk, monday)


@receiver(post_delete, sender=Note)
def clear_cache_on_note_delete(sender, instance: Note, **kwargs):
    user_pk = instance.user.pk
    note_date = instance.created_at.date()
    monday = note_date - timedelta(days=note_date.weekday())
    delete_user_week_cache(user_pk, monday)

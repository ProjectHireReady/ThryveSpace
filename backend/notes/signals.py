# notes/signals.py
from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Note

CATEGORY_VALUE_MAP = {
    "very negative": 1,
    "negative": 2,
    "neutral": 3,
    "positive": 4,
    "very positive": 5,
}


def _map_category_to_value(mood) -> int | None:
    if not mood:
        return None
    cat = getattr(mood, "category", None)
    if isinstance(cat, str):
        return CATEGORY_VALUE_MAP.get(cat)
    return None


@receiver(pre_save, sender=Note)
def fill_mood_value_snapshot(sender, instance: Note, **kwargs):
    """
    Ensure mood_value_snapshot is set from Mood.category on create,
    and kept in sync when mood changes. If the field is explicitly
    set by the caller, we respect that (no overwrite).
    """
    # If caller explicitly provided a snapshot, respect it.
    if instance.mood_value_snapshot is not None:
        return

    # New object → compute from mood (if present)
    if not instance.pk:
        instance.mood_value_snapshot = _map_category_to_value(instance.mood)
        return

    # Existing object → only recompute if mood changed
    try:
        old = sender.objects.only("mood_id", "mood_value_snapshot").get(pk=instance.pk)
    except sender.DoesNotExist:
        # If somehow not found, treat it like a new object
        instance.mood_value_snapshot = _map_category_to_value(instance.mood)
        return

    mood_changed = old.mood_id != getattr(instance, "mood_id", None)
    if mood_changed:
        instance.mood_value_snapshot = _map_category_to_value(instance.mood)

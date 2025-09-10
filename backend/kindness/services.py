# kindness/services.py
from django.utils import timezone
from django.conf import settings

from .models import KindnessMessageLog
from notes.models import Note  # adjust import if your app path differs
from .rules import select_message

KINDNESS_MIN_NOTES = getattr(settings, "KINDNESS_MIN_NOTES", 3)
# We enforce "once per day" by calendar date; rolling windows can be added later if needed.
KINDNESS_RECENT_NOTES_LIMIT = getattr(settings, "KINDNESS_RECENT_NOTES_LIMIT", 7)


def _has_threshold(user) -> bool:
    """Return True if the user has at least KINDNESS_MIN_NOTES notes."""
    return Note.objects.filter(user=user).count() >= KINDNESS_MIN_NOTES


def _sent_today(user) -> bool:
    """Return True if a kindness message has already been logged for the user today."""
    today = timezone.localdate()
    return KindnessMessageLog.objects.filter(
        user=user,
        created_at__date=today,
    ).exists()


def _recent_notes(user, limit: int = None):
    """
    Fetch the user's most recent notes, newest → oldest, and pull the related Mood
    to avoid N+1 queries in the rules engine.
    """
    if limit is None:
        limit = KINDNESS_RECENT_NOTES_LIMIT

    return list(
        Note.objects.filter(user=user)
        .select_related("mood")
        .order_by("-created_at")[:limit]
    )


def get_kindness_message(user):
    """
    Gate by threshold (≥3 notes) and once-per-day cooldown.
    If eligible, select a rule-based message from recent notes and log it.
    """
    # Threshold gate
    if not _has_threshold(user):
        return None, "cooldown_or_threshold"

    # Cooldown gate
    if _sent_today(user):
        return None, "cooldown_or_threshold"

    # Pull recent context for rules
    notes = _recent_notes(user)
    message = select_message(notes) if notes else None
    if not message:
        return None, "no_rules_matched"

    # Persist log of sent message
    KindnessMessageLog.objects.create(
        user=user,
        message=message,
        source="rule_based",
        note_ids_used=[str(n.id) for n in notes[:3] if getattr(n, "id", None)],
    )
    return message, None

# kindness/services.py
from __future__ import annotations

from typing import Optional, Tuple
from django.utils import timezone
from django.conf import settings

from .models import KindnessMessageLog
from notes.selectors import recent_notes_for_user, note_count_for_user
from .rules import select_message

KINDNESS_MIN_NOTES: int = getattr(settings, "KINDNESS_MIN_NOTES", 3)
KINDNESS_RECENT_NOTES_LIMIT: int = getattr(settings, "KINDNESS_RECENT_NOTES_LIMIT", 7)


def _has_threshold(user) -> bool:
    """
    True if the user has at least KINDNESS_MIN_NOTES notes.
    Uses a limited subquery in selectors so the DB can stop early.
    """
    return note_count_for_user(user, min_count=KINDNESS_MIN_NOTES) >= KINDNESS_MIN_NOTES


def _sent_today(user) -> bool:
    """True if a kindness message has already been logged for the user today."""
    today = timezone.localdate()
    return KindnessMessageLog.objects.filter(
        user=user,
        created_at__date=today,
    ).exists()


def get_kindness_message(user) -> Tuple[Optional[str], Optional[str]]:
    """
    Gate by threshold (≥3 notes) and once-per-day cooldown.
    If eligible, select a rule-based message from recent notes and log it.

    Returns:
      (message, error_reason)  # message is None when gated or no rule matched
    """
    # Threshold gate
    if not _has_threshold(user):
        return None, "cooldown_or_threshold"

    # Cooldown gate
    if _sent_today(user):
        return None, "cooldown_or_threshold"

    # Pull recent context for rules
    notes = recent_notes_for_user(user, limit=KINDNESS_RECENT_NOTES_LIMIT)
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

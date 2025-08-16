from django.utils import timezone
from django.conf import settings
from .models import KindnessMessageLog
from notes.models import Note  # adjust import if your app path differs
from .rules import select_message

KINDNESS_MIN_NOTES = getattr(settings, 'KINDNESS_MIN_NOTES', 3)
# We enforce "once per day" by date; leave HOURS for future if you prefer rolling window
KINDNESS_RECENT_NOTES_LIMIT = getattr(settings, 'KINDNESS_RECENT_NOTES_LIMIT', 7)

def _has_threshold(user):
    return Note.objects.filter(user=user).count() >= KINDNESS_MIN_NOTES

def _sent_today(user):
    today = timezone.localdate()
    return KindnessMessageLog.objects.filter(user=user, created_at__date=today).exists()

def _recent_notes(user, limit=KINDNESS_RECENT_NOTES_LIMIT):
    return list(Note.objects.filter(user=user).order_by('-created_at')[:limit])

def get_kindness_message(user):
    if not _has_threshold(user):
        return None, 'cooldown_or_threshold'

    if _sent_today(user):
        return None, 'cooldown_or_threshold'

    notes = _recent_notes(user)
    message = select_message(notes) if notes else None
    if not message:
        return None, 'no_rules_matched'

    KindnessMessageLog.objects.create(
        user=user,
        message=message,
        source='rule_based',
        note_ids_used=[str(n.id) for n in notes[:3] if getattr(n, 'id', None)]
    )
    return message, None

# notes/selectors.py
from typing import List
from .models import Note

def recent_notes_for_user(user, limit: int = 7) -> List[Note]:
    return list(
        Note.objects.filter(user=user)
        .select_related("mood")
        .order_by("-created_at")[:limit]
    )

def note_count_for_user(user, min_count: int = 3) -> int:
    # Slice before count() so DB can short-circuit
    return (
        Note.objects.filter(user=user)
        .order_by()
        .values_list("pk", flat=True)[:min_count]
        .count()
    )

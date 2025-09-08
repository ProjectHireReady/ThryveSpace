# insights/services.py
from dataclasses import dataclass
from datetime import timedelta, date
from typing import List, Dict, Optional

from django.core.cache import cache
from django.db.models import Max, Subquery
from django.db.models.functions import TruncDate
from django.utils import timezone

from notes.models import Note  

WEEK_CACHE_TTL = 300  # 5 minutes

# Map Mood.category (string) -> 1..5
CATEGORY_VALUE_MAP = {
    "very negative": 1,
    "negative": 2,
    "neutral": 3,
    "positive": 4,
    "very positive": 5,
}


@dataclass
class WeekRange:
    start: date  # inclusive, e.g., Monday 00:00
    end: date    # exclusive, start + 7 days


def get_week_range(week_offset: int) -> WeekRange:
    """
    Computes Monday-based week ranges in the active time zone
    (as defined by Django's TIME_ZONE setting).

    week_offset=0 → current week
    week_offset=1 → previous week, and so on.
    """

    now = timezone.localtime(timezone.now())
    # Monday = 0 ... Sunday = 6
    this_monday = (now - timedelta(days=now.weekday())).date()
    start = this_monday - timedelta(days=7 * week_offset)
    end = start + timedelta(days=7)
    return WeekRange(start=start, end=end)


def cache_key(user_id: int, wr: WeekRange) -> str:
    return f"insights:history:{user_id}:{wr.start.isoformat()}"


def _mood_value_for(note: Note) -> Optional[int]:
    """
    Determine a 1..5 mood value for a note.
    Priority:
      1) mood_value_snapshot if present on the model
      2) map Mood.category (string) via CATEGORY_VALUE_MAP
      3) None
    """
    snap = getattr(note, "mood_value_snapshot", None)
    if snap is not None:
        try:
            return int(snap)
        except (TypeError, ValueError):
            return None

    mood = getattr(note, "mood", None)
    if not mood:
        return None

    cat = getattr(mood, "category", None)
    if isinstance(cat, str):
        return CATEGORY_VALUE_MAP.get(cat)

    return None


def fetch_weekly_latest_per_day(user, wr: WeekRange):
    """
    SQLite‑compatible reduction to one row per day (latest note of that day).
    """
    # constrain by date range (end is exclusive)
    qs = Note.objects.select_related("mood").filter(
        user=user,
        created_at__date__gte=wr.start,
        created_at__date__lt=wr.end,
    )

    # 1) compute last timestamp per day
    per_day_latest = (
        qs.annotate(day=TruncDate("created_at"))
          .values("day")
          .annotate(last_created=Max("created_at"))
    )

    # 2) pick the notes matching those last_created timestamps
    latest_notes = (
        qs.annotate(day=TruncDate("created_at"))
          .filter(created_at__in=Subquery(per_day_latest.values("last_created")))
          .order_by("day", "created_at")  # stable ordering
    )

    return list(latest_notes)


def build_response(user, wr: WeekRange) -> Dict:
    # materialize notes
    notes = fetch_weekly_latest_per_day(user, wr)

    # Map day -> note
    by_day = {n.created_at.date(): n for n in notes}

    # Build graph for 7 days
    graph: List[Dict] = []
    timeline: List[Dict] = []

    for i in range(7):
        d = wr.start + timedelta(days=i)
        note = by_day.get(d)
        if note:
            mv = _mood_value_for(note)
            mid = getattr(note.mood, "id", None)
            graph.append({"date": d.isoformat(), "mood_value": mv, "mood_id": mid})
            # timeline entry (use your Note.note field; trim to 120 chars)
            snippet = (getattr(note, "note", "") or "").strip().replace("\n", " ")
            if len(snippet) > 120:
                snippet = snippet[:117].rstrip() + "..."
            timeline.append({
                "date": d.isoformat(),
                "mood_value": mv,
                "mood_id": mid,
                "snippet": snippet,
            })
        else:
            graph.append({"date": d.isoformat(), "mood_value": None, "mood_id": None})

    return {
        "week": {
            "start": wr.start.isoformat(), 
            "end": (wr.end - timedelta(days=1)).isoformat(),  
        },
        "graph": graph,
        "timeline": timeline,
    }


def get_history_payload(user, week_offset: int) -> Dict:
    wr = get_week_range(week_offset)
    key = cache_key(user.id, wr)

    cached = cache.get(key)
    if cached is not None:
        return cached

    payload = build_response(user, wr)
    cache.set(key, payload, timeout=WEEK_CACHE_TTL)
    return payload

# insights/services.py
from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta, date
from typing import List, Dict, Optional, Any

from django.core.cache import cache
from django.db.models import Max, Subquery
from django.db.models.functions import TruncDate
from django.utils import timezone

from notes.models import Note  # <-- needed for typing + queryset
from moods.constants import CATEGORY_NUMERIC_MAPPING

WEEK_CACHE_TTL = 604800  # 1 week


@dataclass
class WeekRange:
    start: date  # inclusive (Monday 00:00 localdate)
    end: date  # exclusive (start + 7 days)


# -------------------------------
# Centralized weekly helpers
# -------------------------------


def parse_week_offset(request, allow_negative: bool = False) -> int:
    """
    Parse ?week_offset=<int> (or ?week=<int>).
    - If allow_negative is False, values < 0 raise ValueError.
    - Invalid inputs raise ValueError.
    """
    raw = request.query_params.get("week_offset", request.query_params.get("week", "0"))
    try:
        val = int(raw)
    except (TypeError, ValueError):
        raise ValueError("week_offset must be an integer")
    if not allow_negative and val < 0:
        raise ValueError("week_offset must be >= 0")
    return val


def get_week_range(week_offset: int) -> WeekRange:
    """
    Monday-based week in active TZ.
    week_offset=0 → current week; 1 → previous week; etc.
    """
    now = timezone.localtime(timezone.now())
    this_monday = (now - timedelta(days=now.weekday())).date()  # Monday
    start = this_monday - timedelta(days=7 * week_offset)
    end = start + timedelta(days=7)  # exclusive
    return WeekRange(start=start, end=end)


def get_week_points(user, week_offset: int) -> List[Dict[str, Optional[Any]]]:
    """
    Returns 7 points for the requested week as (ISO date, mood_value|None),
    using the SAME reducer as history (latest note per day, snapshot-first).
    """
    payload = get_history_payload(user, week_offset)
    return [{"day": p["date"], "category": p["mood_value"]} for p in payload["graph"]]


# -------------------------------
# Internals used by history/tip
# -------------------------------


def cache_key(user_pk: Any, wr: WeekRange) -> str:
    # Robust to int/UUID/string PKs
    return f"insights:history:{str(user_pk)}:{wr.start.isoformat()}"


def cache_key_for(prefix: str, user_pk: Any, wr: WeekRange) -> str:
    # Use this for tip/prediction: e.g., prefix="tip" or "prediction"
    return f"insights:{prefix}:{str(user_pk)}:{wr.start.isoformat()}"


def _mood_value_for(note: Note) -> Optional[int]:
    """
    Determine a 1..5 mood value for a note.
    Priority:
      1) mood_value_snapshot if present on the model
      2) map Mood.category (string) via CATEGORY_NUMERIC_MAPPING
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

    if cat:
        cat_value = getattr(cat, "value", None)

        if isinstance(cat_value, str):
            return CATEGORY_NUMERIC_MAPPING.get(cat_value.lower())
    return None


def fetch_weekly_latest_per_day(user, wr: WeekRange) -> List[Note]:
    """
    SQLite-compatible reduction to one row per day (latest note of that day).
    If multiple notes share the exact same timestamp that is the day's latest,
    tie-break by highest PK.
    """
    qs = Note.objects.select_related("mood").filter(
        user=user,
        created_at__date__gte=wr.start,
        created_at__date__lt=wr.end,  # exclusive
    )

    per_day_latest = (
        qs.annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(last_created=Max("created_at"))
    )

    # Join back on (day,last_created) and tie-break by pk desc
    latest_notes = (
        qs.annotate(day=TruncDate("created_at"))
        .filter(created_at__in=Subquery(per_day_latest.values("last_created")))
        .order_by("day", "-created_at", "-pk")  # stable, prefer newest pk on ties
    )

    # Reduce to one per day (since multiple rows may share same created_at)
    by_day: Dict[date, Note] = {}
    for n in latest_notes:
        d = n.created_at.date()
        if d not in by_day:
            by_day[d] = n
    # Keep chronological order by day
    return [by_day[d] for d in sorted(by_day.keys())]


def build_response(user, wr: WeekRange) -> Dict:
    notes = fetch_weekly_latest_per_day(user, wr)
    by_day = {n.created_at.date(): n for n in notes}

    graph: List[Dict] = []
    timeline: List[Dict] = []

    for i in range(7):
        d = wr.start + timedelta(days=i)
        note = by_day.get(d)
        if note:
            mv = _mood_value_for(note)
            mid = getattr(note.mood, "id", None)
            graph.append({"date": d.isoformat(), "mood_value": mv, "mood_id": mid})
            snippet = (getattr(note, "note", "") or "").strip().replace("\n", " ")
            if len(snippet) > 120:
                snippet = snippet[:117].rstrip() + "..."
            timeline.append(
                {
                    "date": d.isoformat(),
                    "mood_value": mv,
                    "mood_id": mid,
                    "snippet": snippet,
                }
            )
        else:
            graph.append({"date": d.isoformat(), "mood_value": None, "mood_id": None})

    # Return inclusive week_end (end - 1 day) for display clarity
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
    key = cache_key(user.pk, wr)

    cached = cache.get(key)
    if cached is not None:
        return cached

    payload = build_response(user, wr)
    cache.set(key, payload, timeout=WEEK_CACHE_TTL)
    return payload

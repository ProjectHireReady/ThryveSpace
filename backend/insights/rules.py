from dataclasses import dataclass
from datetime import date, timedelta
from typing import List, Dict, Optional

# Map mood category → numeric score for trend detection (centered at 0)
MOOD_TO_SCORE = {
    "very negative": -2,
    "negative": -1,
    "neutral": 0,
    "positive": 1,
    "very positive": 2,
}
LOW_MOODS = {"very negative", "negative"}


@dataclass
class MoodPoint:
    day: date  # calendar day (local)
    category: str  # one of the 5 categories above


def day_points_from_notes(notes) -> List[MoodPoint]:
    """
    Convert a queryset/list of Note into per-day MoodPoints.
    If multiple notes exist in a day, we pick the 'worst' (lowest score).
    Assumes note.mood.category holds one of the 5 categories.
    """
    by_day: Dict[date, List[str]] = {}
    for note in notes:
        d = note.created_at.date()
        cat = (
            note.mood.category if getattr(note, "mood", None) else "neutral"
        ) or "neutral"
        cat = cat.strip().lower()
        by_day.setdefault(d, []).append(cat)

    points: List[MoodPoint] = []
    for d, cats in by_day.items():
        worst = min(cats, key=lambda c: MOOD_TO_SCORE.get(c, 0))
        points.append(MoodPoint(day=d, category=worst))
    points.sort(key=lambda p: p.day)
    return points


def detect_low_streak(points: List[Dict]) -> Optional[int]:
    """
    Returns length of longest SAME-category low-mood streak (if >=3), else None.
    """
    best_len = 0
    i = 0
    while i < len(points):
        if points[i]["category"] in LOW_MOODS:
            j = i + 1
            while (
                j < len(points)
                and points[j]["category"] == points[i]["category"]
                and (points[j]["day"] - points[j - 1]["day"]).days == 1
            ):
                j += 1
            best_len = max(best_len, j - i)
            if best_len >= 3:
                return best_len
            i = j
        else:
            i += 1
    return None


def compute_trend(points: List[Dict]) -> float:
    """
    Simple trend: average score (last half) - average score (first half).
    Positive => improving, negative => declining.
    """
    if len(points) < 4:
        return 0.0
    scores = [MOOD_TO_SCORE.get(p["category"], 0) for p in points]
    mid = len(scores) // 2
    first = scores[:mid]
    second = scores[mid:]
    if not first or not second:
        return 0.0
    return (sum(second) / len(second)) - (sum(first) / len(first))


def missing_days_in_window(points: List[Dict], week_start: date) -> int:
    present = {p["day"] for p in points}
    window = {week_start + timedelta(days=i) for i in range(7)}
    return len(window - present)


def render_tip(points: List[MoodPoint], week_start: date) -> Dict[str, str]:
    """
    Deterministic rule order:
      1) Same low-mood streak >= 3 days
      2) Declining trend (<= -0.6) or rising trend (>= 0.6)
      3) Missing entries >= 3 days
      4) Gentle default
    """
    streak = detect_low_streak(points)
    if streak and streak >= 3:
        return {
            "type": "tip",
            "message": f"Noticed {streak} days in a row of low mood. Try a gentle reset today: water, a short stretch, or an early night.",
        }

    delta = compute_trend(points)
    if delta <= -0.6:
        return {
            "type": "tip",
            "message": "Your mood dipped this week. Consider one small tweak—10 minutes of movement, hydration, or a short check-in with a friend.",
        }
    if delta >= 0.6:
        return {
            "type": "tip",
            "message": "Nice upward trend! Double down on what helped—note one thing that lifted your mood so you can reuse it.",
        }

    if missing_days_in_window(points, week_start) >= 3:
        return {
            "type": "tip",
            "message": "You skipped a few days. No pressure—do a 10-second mood check-in today to rebuild the habit.",
        }

    return {
        "type": "tip",
        "message": "Keep checking in. Pick one small thing that felt good this week and try it again tomorrow.",
    }

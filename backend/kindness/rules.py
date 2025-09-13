# kindness/rules.py
import re
from django.utils import timezone

NEGATIVE = ["tired", "exhausted", "fatigue", "drained", "sad"]
STRESS   = ["anxious", "worry", "worried", "stress", "stressed", "overwhelmed"]
POSITIVE = ["grateful", "gratitude", "thankful", "joy", "proud"]

# Map Mood.category → score
CATEGORY_SCORE = {
    "very negative": 1,
    "negative": 2,
    "neutral": 3,
    "positive": 4,
    "very positive": 5,
}

# Fallback by name if category missing/unexpected
NAME_SCORE = {
    "very sad": 1, "awful": 1, "terrible": 1,
    "sad": 2, "bad": 2, "down": 2,
    "neutral": 3, "okay": 3, "fine": 3,
    "happy": 4, "good": 4, "better": 4,
    "very happy": 5, "great": 5, "excellent": 5,
}

def _has_word(words, text: str) -> bool:
    """
    True if any word in `words` appears as a whole word in `text`.
    Uses regex word boundaries to avoid matching substrings
    (e.g., 'stressed' should not match 'distressed').
    """
    return any(re.search(rf"\b{re.escape(w)}\b", text) for w in words)

def _score_from_mood(mood_obj):
    """Convert a Mood FK to 1–5 score using category first, then name; default 3."""
    if mood_obj is None:
        return 3
    cat = getattr(mood_obj, "category", None)
    if isinstance(cat, str) and cat.lower() in CATEGORY_SCORE:
        return CATEGORY_SCORE[cat.lower()]
    name = getattr(mood_obj, "name", None)
    if isinstance(name, str):
        return NAME_SCORE.get(name.strip().lower(), 3)
    return 3

def _mood_trend(notes):
    """Notes newest→oldest; compare newest vs oldest among last 3 by score."""
    scores = [_score_from_mood(getattr(n, "mood", None)) for n in notes[:3]]
    if len(scores) < 2:
        return "flat"
    if scores[0] > scores[-1]:
        return "up"
    if scores[0] < scores[-1]:
        return "down"
    return "flat"

def select_message(notes):
    text_blob = " ".join([(n.note or "") for n in notes[:5]]).lower()
    weekday = timezone.localdate().weekday()  # 0=Mon, 4=Fri

    if _has_word(STRESS, text_blob):
        return "Slow breaths. You’re doing enough—try a 60-second pause before the next task."
    if _has_word(NEGATIVE, text_blob):
        return "You’ve been pushing hard. A short break and some water can help—be kind to yourself."
    if _has_word(POSITIVE, text_blob):
        return "Nice! Capture one small win you’re grateful for today—keep the momentum."

    trend = _mood_trend(notes)
    if trend == "down":
        return "Tough patches pass. One tiny step today still counts—be gentle with yourself."
    if trend == "up":
        return "Love the upswing—acknowledge the effort that got you here!"

    if weekday == 0:   # Monday
        return "New week, fresh start. Pick one kind priority and do it lightly."
    if weekday == 4:   # Friday
        return "You made it through—celebrate one small win."

    return "Take a breath. You’re doing better than you think—choose one kind action for yourself."

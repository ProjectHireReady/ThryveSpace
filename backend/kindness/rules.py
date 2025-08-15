# kindness/rules.py
from django.utils import timezone

# Keyword buckets
NEGATIVE = ["tired", "exhausted", "fatigue", "drained", "sad"]
STRESS   = ["anxious", "worry", "worried", "stress", "stressed", "overwhelmed"]
POSITIVE = ["grateful", "gratitude", "thankful", "joy", "proud"]

# Map common mood names to a rough 1–5 score (fallback = 3)
_NAME_SCORE = {
    "very sad": 1, "awful": 1, "terrible": 1,
    "sad": 2, "bad": 2, "down": 2,
    "neutral": 3, "okay": 3, "fine": 3,
    "happy": 4, "good": 4, "better": 4,
    "very happy": 5, "great": 5, "excellent": 5,
}

def _score_from_mood(mood_obj):
    """Convert a Mood FK (or None) into an int score (1–5)."""
    if mood_obj is None:
        return 3
    # Prefer explicit numeric fields if your model has them
    for attr in ("score", "value", "level", "rating"):
        v = getattr(mood_obj, attr, None)
        if isinstance(v, (int, float)):
            return int(v)
    # Otherwise try by name
    name = getattr(mood_obj, "name", None)
    if isinstance(name, str):
        return _NAME_SCORE.get(name.strip().lower(), 3)
    return 3

def _mood_trend(notes):
    """Notes should be newest→oldest. Compare score of newest vs oldest among last 3."""
    scores = [_score_from_mood(getattr(n, "mood", None)) for n in notes[:3]]
    scores = [s for s in scores if s is not None]
    if len(scores) < 2:
        return "flat"
    if scores[0] > scores[-1]:
        return "up"
    if scores[0] < scores[-1]:
        return "down"
    return "flat"

def select_message(notes):
    text_blob = " ".join([(n.note or "") for n in notes[:5]]).lower()
    weekday = timezone.localdate().weekday()  # 0=Mon ... 6=Sun

    if any(w in text_blob for w in STRESS):
        return "Slow breaths. You’re doing enough—try a 60-second pause before the next task."
    if any(w in text_blob for w in NEGATIVE):
        return "You’ve been pushing hard. A short break and some water can help—be kind to yourself."
    if any(w in text_blob for w in POSITIVE):
        return "Nice! Capture one small win you’re grateful for today—keep the momentum."

    trend = _mood_trend(notes)
    if trend == "down":
        return "Tough patches pass. One tiny step today still counts—be gentle with yourself."
    if trend == "up":
        return "Love the upswing—acknowledge the effort that got you here!"

    if weekday == 0:  # Monday
        return "New week, fresh start. Pick one kind priority and do it lightly."
    if weekday == 4:  # Friday
        return "You made it through—celebrate one small win."

    return "Take a breath. You’re doing better than you think—choose one kind action for yourself."


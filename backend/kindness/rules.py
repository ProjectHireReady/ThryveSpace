from django.utils import timezone

# Very simple keyword buckets you can expand later
NEGATIVE = ['tired', 'exhausted', 'fatigue', 'drained', 'sad']
STRESS   = ['anxious', 'worry', 'worried', 'stress', 'stressed', 'overwhelmed']
POSITIVE = ['grateful', 'gratitude', 'thankful', 'joy', 'proud']

def _mood_trend(notes):
    # expects notes ordered newest→oldest; uses last 3 moods
    moods = [n.mood for n in notes[:3] if getattr(n, 'mood', None) is not None]
    if len(moods) < 2:
        return 'flat'
    if moods[0] > moods[-1]:
        return 'up'
    if moods[0] < moods[-1]:
        return 'down'
    return 'flat'

def select_message(notes):
    text_blob = ' '.join([(n.note or '') for n in notes[:5]]).lower()
    weekday = timezone.localdate().weekday()  # 0=Mon, 4=Fri

    if any(w in text_blob for w in STRESS):
        return "Slow breaths. You’re doing enough—try a 60-second pause before the next task."
    if any(w in text_blob for w in NEGATIVE):
        return "You’ve been pushing hard. A short break and some water can help—be kind to yourself."
    if any(w in text_blob for w in POSITIVE):
        return "Nice! Capture one small win you’re grateful for today—keep the momentum."

    trend = _mood_trend(notes)
    if trend == 'down':
        return "Tough patches pass. One tiny step today still counts—be gentle with yourself."
    if trend == 'up':
        return "Love the upswing—acknowledge the effort that got you here!"

    if weekday == 0:  # Monday
        return "New week, fresh start. Pick one kind priority and do it lightly."
    if weekday == 4:  # Friday
        return "You made it through—celebrate one small win."

    return "Take a breath. You’re doing better than you think—choose one kind action for yourself."

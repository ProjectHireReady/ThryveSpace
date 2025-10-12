import json
from notes.models import Note
from notes.serializers import NoteInsightSerializer
from datetime import date, timedelta, datetime, time
from django.utils import timezone
from openai import OpenAI
import logging
from django.conf import settings
from django.core.cache import cache
from .constants import CATEGORY_VALUE_MAP


logger = logging.getLogger(__name__)


def get_openai_client():
    api_key = getattr(settings, "OPENAI_API_KEY", None)
    if not api_key:
        raise RuntimeError("OpenAI API key is not set in settings.OPENAI_API_KEY")
    return OpenAI(api_key=api_key)


def get_week_range(week_offset: int):
    """
    Monday-anchored 7-day window in local TZ.
    Returns (week_start_date, week_end_date).
    """
    today = timezone.localdate()
    current_week_start = today - timedelta(days=today.weekday())  # Monday
    target_week_start = current_week_start - timedelta(weeks=week_offset)
    target_week_end = target_week_start + timedelta(days=6)
    return target_week_start, target_week_end


def build_week_summary(user, week_offset: int = 0):
    """Build the week summary payload for the given user and week offset."""
    week_start, week_end = get_week_range(week_offset)

    # Query notes for the week
    notes = (
        Note.objects.filter(
            user=user,
            created_at__date__range=[week_start, week_end],
        )
        .select_related("mood")
        .order_by("created_at")
    )

    # For each day, pick the latest note's mood value
    day_mood_map = {}
    for note in notes:
        note_date = note.created_at.date()
        mood_value = (
            CATEGORY_VALUE_MAP.get(note.mood.category, None) if note.mood else None
        )
        day_mood_map[note_date] = (
            mood_value  # latest wins due to .order_by("created_at")
        )

    # Build graph
    graph = []
    for i in range(7):
        d = week_start + timedelta(days=i)
        graph.append({"date": d, "mood_value": day_mood_map.get(d)})

    # Timeline
    timeline_qs = notes.order_by("-created_at")
    timeline = NoteInsightSerializer(timeline_qs, many=True).data

    payload = {
        "week_start": week_start,
        "week_end": week_end,
        "graph": graph,
        "timeline": timeline,
    }

    # Final payload
    return payload


def get_daily_limit():
    now = timezone.now()
    midnight = datetime.combine(
        now.date(), time.max, tzinfo=now.tzinfo
    )  # Set to the true end of day (23:59:59.999999)

    return int((midnight - now).total_seconds())


def today_key_suffix():
    return date.today().strftime("%Y%m%d")


def increment_count(key: str, ttl: int = 86400) -> int:
    """Increment the count for a given key with an expiration time."""
    with cache.lock(f"lock:{key}", timeout=5):
        count = cache.get(key, 0)
        count = int(count) + 1
        cache.set(key, count, timeout=ttl)
        return count


def get_count(key: str) -> int:
    """Get the current count for a given key."""
    count = cache.get(key, 0)
    return int(count)


def mock_ai_response(prompt, meta=None):
    return {
        "content": f"Mock AI response to: {prompt[:50]}...",
        "meta": {"length": len(prompt), "mock": True},
    }


def real_ai_response(prompt, meta=None):
    """Integrate with a real AI service here."""
    client = get_openai_client()

    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a supportive, thoughtful mentor. "
                        "When a user shares a short daily note or reflection, provide gentle, encouraging feedback. "
                        "Highlight positive themes, acknowledge their effort, and, if possible, suggest one small area of reflection or improvement in a warm and concise way. "
                        "Keep the response under 3–4 sentences."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=150,
        )
        return {
            "content": resp.choices[0].message.content,
        }
    except Exception as e:
        logger.warning("Error calling AI service, falling back: %s", e)
        return {
            "content": "Looks like we’re having a brief pause preparing your weekly insights. Take a moment to breathe — we’ll have your reflections ready soon."
        }


def get_ai_response(prompt, meta=None):
    if getattr(settings, "USE_MOCK_AI", True):
        return mock_ai_response(prompt, meta)
    return real_ai_response(prompt, meta)


def analyze_week_summary(payload: dict):
    """
    Send weekly mood/journal payload to OpenAI for analysis.
    Returns structured response (dict).
    """
    if settings.USE_MOCK_AI:
        return {
            "content": "Mock analysis: This week shows a positive trend with consistent moods. Keep it up!",
        }

    # Prompt instructions
    prompt = [
        {
            "role": "system",
            "content": "You are ThryveSpace's emotional insights engine.",
        },
        {
            "role": "user",
            "content": f"""
    Analyze the following user's mood entries for the week and return structured insights.

    Mood data:
    {payload["timeline"]}

    Respond strictly in JSON with:
    - tips: array of 2–4 brief motivational tips (strings)
    - predictions: array of 1–3 objects with 'label' and optional 'icon'

    Example:
    {{
    "tips": ["Stay consistent with journaling.", "Try morning reflections for clarity."],
    "predictions": [
        {{"label": "Calm", "icon": "🌿"}},
        {{"label": "Optimistic", "icon": "🌤️"}}
    ]
    }}
    """,
        },
    ]

    try:
        client = get_openai_client()

        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=prompt,
            response_format={"type": "json_object"},
        )

        # Extract and return the content
        try:
            parsed_content = json.loads(resp.choices[0].message.content)
            return {
                "content": parsed_content,
            }
        except json.JSONDecodeError as json_err:
            logger.warning("Error decoding AI response JSON: %s", json_err)
            return {
                "tips": ["Take a few moments to reflect today."],
                "predictions": [{"label": "Insight unavailable", "icon": "⏳"}],
            }

    except Exception as e:
        logger.warning("Error calling AI service: %s", e)
        return {
            "tips": ["Take a few moments to reflect today."],
            "predictions": [{"label": "Insight unavailable", "icon": "⏳"}],
        }

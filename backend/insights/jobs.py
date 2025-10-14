from .utils import (
    get_ai_response,
    build_week_summary,
    analyze_week_summary,
    get_week_range,
)
from .models import Insight


def generate_note_feedback(note_id, user=None, note_text=""):
    """Create AI feedback for a note."""
    if not note_text or note_text.strip() == "":
        return {"error": "No note text provided."}

    prompt = f"Provide constructive feedback for the following note: {note_text}"
    response = get_ai_response(
        prompt,
        meta={
            "note_id": note_id if note_id else None,
            "user_id": user.id if user else None,
        },
    )
    content = response.get("content", "No feedback generated.")

    # Save the insight to the database
    if user:
        Insight.objects.create(user=user, type="note_feedback", content=content)
    return content


def process_user_insights(user, week_offset=0):
    """Background job to process history-based insights."""
    summary = build_week_summary(user, week_offset)

    response = analyze_week_summary(summary)
    content = response.get("content", "No insights generated.")

    # Save the insight to the database
    insight = Insight.objects.create(
        user=user,
        type="summary",
        content=content,
        week_start=get_week_range(week_offset)[0],
    )
    response["ETag"] = insight.updated_at.isoformat()

    return response

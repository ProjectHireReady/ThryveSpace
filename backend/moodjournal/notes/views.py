# moodjournal/notes/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
import uuid

# In-memory store (this list will be reset every time the server restarts)
JOURNAL_ENTRIES = []

@csrf_exempt
def save_note(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            mood = data.get("mood")
            note = data.get("note")

            # Handle missing/empty user_id gracefully (Trello Checklist Item 4)
            if not user_id:
                return JsonResponse(
                    {"error": "user_id is required."},
                    status=400 # HTTP 400 Bad Request
                )

            # Save entries temporarily in in-memory storage (Trello Checklist Item 2)
            entry = {
                "id": str(uuid.uuid4()), # Generate a unique ID for the entry
                "user_id": user_id,
                "mood": mood,
                "note": note,
                "timestamp": timezone.now().isoformat()
            }

            JOURNAL_ENTRIES.append(entry)

            # Return success response (Trello Checklist Item 3)
            return JsonResponse(
                {"message": "Journal entry saved successfully!", "data": entry},
                status=201 # HTTP 201 Created
            )
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON in request body."}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Method not allowed."}, status=405)
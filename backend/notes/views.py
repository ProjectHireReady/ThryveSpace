# backend/notes/views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

# Import your models from their new locations
from notes.models import Note
from moods.models import Mood

# The global JOURNAL_ENTRIES list and its related comment are now completely obsolete.
# You can remove this entire line or keep it commented out for historical context.

@csrf_exempt
def save_note(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON in request body.'}, status=400)

        # Extract data from the request
        user_id = data.get('user_id')
        mood_name = data.get('mood') # Assuming frontend sends mood 'name' (e.g., 'happy')
        content = data.get('note', '') # 'content' is the field name in your Note model

        # --- Validation & Object Fetching ---
        if not user_id:
            return JsonResponse({'error': 'user_id is required.'}, status=400)

        # Get the custom User model
        User = get_user_model()
        try:
            # Fetch the User object using the provided user_id
            # Assuming user_id from frontend is the UUID primary key of the User model
            user_obj = get_object_or_404(User, id=user_id)
        except Exception: # Catch any error, like invalid UUID format
            return JsonResponse({'error': 'Invalid or non-existent user_id.'}, status=400)


        mood_obj = None
        if mood_name:
            try:
                # Fetch the Mood object by its name (case-insensitive for robustness)
                mood_obj = get_object_or_404(Mood, name__iexact=mood_name)
            except Exception:
                # If mood name is provided but doesn't exist, return an error
                return JsonResponse({'error': f"Mood '{mood_name}' not found."}, status=400)

        # --- Create and Save Note Object ---
        try:
            note = Note.objects.create(
                user=user_obj,
                mood=mood_obj, # This will be None if 'mood_name' was not provided in request
                content=content
            )

            # --- Prepare Response Data ---
            # Use a dictionary to build your response data for clarity
            response_data = {
                'id': str(note.id), # Convert UUID to string for JSON
                'user_id': str(note.user.id),
                'mood': note.mood.name if note.mood else None, # Return mood's name if exists, else None
                'content': note.content,
                'created_at': note.created_at.isoformat(), # ISO 8601 format for timestamps
                'updated_at': note.updated_at.isoformat(),
            }
            return JsonResponse({
                'message': 'Note saved successfully!', # Changed from "Journal entry saved successfully!"
                'data': response_data
            }, status=201)

        except Exception as e:
            # Catch any unexpected database errors during creation
            return JsonResponse({'error': f'An unexpected error occurred while saving: {str(e)}'}, status=500)
    else:
        # Handle non-POST requests
        return JsonResponse({'error': 'Method not allowed.'}, status=405)
# Mock Journal Entry Save API

This API endpoint allows the frontend to submit user journal entries for temporary storage.

## Endpoint: Save Journal Entry

* **URL:** `/api/notes/` (or `/api/inputs/` if that's the final path agreed upon by your team in `moodjournal/urls/__init__.py`)
* **Method:** `POST`

### Request Body (JSON)

Accepts a JSON object with the following fields:

| Field     | Type   | Description                                           | Required | Example Value                 |
| :-------- | :----- | :---------------------------------------------------- | :------- | :---------------------------- |
| `user_id` | String | Unique identifier for the user.                       | Yes      | `"benjamin_user_123"`         |
| `mood`    | String | (Optional) The user's mood for this entry.            | No       | `"accomplished"`              |
| `note`    | String | (Optional) The actual journal entry text.             | No       | `"Finished the mock API today!"` |

### Success Response (HTTP 201 Created)

```json
{
    "message": "Journal entry saved successfully!",
    "data": {
        "id": "a-unique-uuid-string",
        "user_id": "benjamin_user_123",
        "mood": "accomplished",
        "note": "My first journal entry using the new API!",
        "timestamp": "YYYY-MM-DDTHH:MM:SS.f+00:00"
    }
}

## Error Responses

### HTTP 400 Bad Request (Missing user_id)
```json
{
    "error": "user_id is required."
}

HTTP 400 Bad Request (Invalid JSON)
```json
{
    "error": "Invalid JSON in request body."
}

### HTTP 405 Method Not Allowed (e.g., trying GET request)
```json
{
    "error": "Method not allowed."
}
```
### HTTP 500 Internal Server Error (Unexpected server error)
```json
{
    "error": "An unexpected error occurred: [error details]"
}
```
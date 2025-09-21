# Notes API Documentation

This document describes the API endpoint for creating and managing notes.

---

## 1. Create a New Note Entry

**Endpoint:**  
`POST /api/v1/notes/`

**Description:**  
Allows authenticated users to create a new note entry, optionally with a title and mood.

### Request

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/v1/notes/`
- **Headers:**
    - `Authorization: Bearer <your_access_token>` 🔐
    - `Content-Type: application/json`
- **Body (JSON):**

| Field      | Type   | Required | Description                                   | Example                                               |
|------------|--------|----------|-----------------------------------------------|-------------------------------------------------------|
| note       | string | Yes      | The primary content of the note.              | `"Today was a productive day, feeling grateful."`     |
| title      | string | No       | An optional title for the note.               | `"A Great Day"`                                       |
| mood_name  | string | No       | The name of a mood. Must exist in Mood table. | `"Happy"`                                             |

**Notes:**
- The API automatically associates the note with the authenticated user; `user_id` is not required in the request body.
- The `mood_name` field is used to look up a Mood object.
- The `title` field is optional.

**Example Request Body:**

```json
{
    "title": "My First Note",
    "note": "This is a new note entry about a happy day!",
    "mood_name": "Happy"
}
```

---

## 2. Responses

### 2.1. Success (HTTP 201 Created)

**Description:**  
Returns a lean representation of the newly created note.

**Example Response:**

```json
{
    "id": "e743e219-3b61-4d1e-98f4-382ee65be0cb",
    "mood": {
        "id": "f9e41069-1dcb-4f29-a261-abff2ff2adbd",
        "name": "Happy",
        "emoji": "😀",
        "category": 1
    },
    "note": "This is a new note entry about a happy day!",
    "title": "My First Note",
    "created_at": "2025-06-13T15:30:52.509487Z",
    "updated_at": "2025-06-13T15:30:52.509513Z"
}
```

**Notes:**
- The `user` field is omitted for a lean response.
- The `title` field is included in the response.
- The `mood` object includes a numeric `category` field.

---

### 2.2. Error Responses

- **HTTP 401 Unauthorized:** User is not authenticated.
- **HTTP 400 Bad Request:** Validation errors or incorrect data.

    - *Missing `note` field:*
        ```json
        {
            "note": ["This field is required."]
        }
        ```

    - *Mood not found:*
        ```json
        {
            "mood_name": ["Mood not found."]
        }
        ```

- **HTTP 405 Method Not Allowed:** If a method other than POST is used.
- **HTTP 500 Internal Server Error:** Unexpected server-side errors.

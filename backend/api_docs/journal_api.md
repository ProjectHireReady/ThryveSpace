# Journal Notes API Documentation

This document outlines the usage of the API endpoint for creating and managing journal notes.

---

## 1. Create a New Journal Entry

**Endpoint:** `POST /api/notes/`

**Description:**  
This endpoint allows clients (e.g., the frontend application) to submit a new journal entry. The entry is linked to a specific user and can optionally be associated with a mood. The data is persisted to the database.

### Request

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/notes/`
- **Headers:**
    - `Content-Type: application/json`

**Body (JSON):**

| Field     | Type     | Required | Description                                                                 | Example                                      |
|-----------|----------|----------|-----------------------------------------------------------------------------|----------------------------------------------|
| `user_id` | string   | Yes      | The UUID of the user creating the journal entry.                            | `"a1b2c3d4-e5f6-7890-1234-567890abcdef"`     |
| `mood`    | string   | No       | The name of the mood associated with the note (e.g., "happy", "sad"). Must exist in the `Mood` database table. | `"happy"`                                    |
| `note`    | string   | Yes      | The actual content/text of the journal entry.                               | `"Today was a productive day, feeling grateful."` |

**Example Request Body:**

```json
{
        "user_id": "YOUR_USER_UUID_HERE",
        "mood": "happy",
        "note": "This is a journal entry about a happy day!"
}
```

---

## 2. Responses

### 2.1. Success Response (HTTP 201 Created)

**Description:**  
Returned when a journal entry is successfully created and saved to the database.

**Body (JSON):**

| Field             | Type   | Description                                               | Example                                         |
|-------------------|--------|-----------------------------------------------------------|-------------------------------------------------|
| `message`         | string | A confirmation message.                                   | `"Journal entry saved successfully!"`           |
| `data.id`         | string | The UUID of the newly created journal entry.              | `"10793b4b-a85c-4db6-9770-457444198259"`        |
| `data.user_id`    | string | The UUID of the user associated with the entry.           | `"YOUR_USER_UUID_HERE"`                         |
| `data.mood`       | string | The name of the associated mood, or null if not provided. | `"Happy"`                                       |
| `data.content`    | string | The content of the journal entry.                         | `"This is a journal entry saved to the database!"` |
| `data.created_at` | string | ISO 8601 timestamp of when the entry was created.         | `"2025-06-09T12:35:40.631700+00:00"`            |
| `data.updated_at` | string | ISO 8601 timestamp of when the entry was last updated.    | `"2025-06-09T12:35:40.631739+00:00"`            |

**Example Success Response:**

```json
{
        "message": "Journal entry saved successfully!",
        "data": {
                "id": "10793b4b-a85c-4db6-9770-457444198259",
                "user_id": "YOUR_USER_UUID_HERE",
                "mood": "Happy",
                "content": "This is a journal entry saved to the database!",
                "created_at": "2025-06-09T12:35:40.631700+00:00",
                "updated_at": "2025-06-09T12:35:40.631739+00:00"
        }
}
```

---

### 2.2. Error Responses

#### HTTP 400 Bad Request

Occurs for various validation failures or incorrect data.

- **Missing `user_id`:**

        ```json
        {
                "error": "user_id is required."
        }
        ```

- **Invalid or Non-existent `user_id`:**

        ```json
        {
                "error": "Invalid or non-existent user_id."
        }
        ```

- **Invalid JSON in request body:**

        ```json
        {
                "error": "Invalid JSON in request body."
        }
        ```

- **Mood not found:**

        ```json
        {
                "error": "Mood 'hppy' not found."
        }
        ```

#### HTTP 405 Method Not Allowed

Occurs if an HTTP method other than POST is used on this endpoint.

**Example Response:**

```json
{
        "error": "Method not allowed."
}
```

#### HTTP 500 Internal Server Error

Occurs for unexpected server-side errors during processing.

**Example Response:**

```json
{
        "error": "An unexpected error occurred while saving: [details of error]"
}
```

---
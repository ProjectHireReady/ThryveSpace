# Notes API Documentation

This document describes the API endpoint for creating and managing notes.

---

## 1. Create a New Note Entry

**Endpoint:** `POST /api/v1/notes/`

**Description:**  
Allows clients to create a new note entry linked to a user, optionally associated with a mood. Data is saved to the database.

### Request

- **Method:** `POST`
- **URL:** `http://localhost:8000/api/v1/notes/`
- **Headers:**
    - `Content-Type: application/json`

**Body (JSON):**

| Field       | Type     | Required | Description                                                                                             | Example                                    |
| :---------- | :------- | :------- | :------------------------------------------------------------------------------------------------------ | :----------------------------------------- |
| `user_id`   | `string` | Yes      | UUID of the user creating the note.                                                                     | `"068a9f5f-22c1-4149-9b54-33fbac32e6a7"`   |
| `mood_name` | `string` | No       | Name of the mood (must exist in the `Mood` table).                                                      | `"Surprised"`                              |
| `note`      | `string` | Yes      | Content of the note.                                                                                    | `"Today was a productive day, feeling grateful."` |

**Notes:**
- Use `mood_name` (not `mood`) to match the serializer input.
- Use `note` (not `content`) to match the model field.

**Example Request Body:**

```json
{
    "user_id": "068a9f5f-22c1-4149-9b54-33fbac32e6a7",
    "mood_name": "Surprised",
    "note": "This is a new note entry about a happy day!"
}
```

---

### 2. Responses

#### 2.1. Success (HTTP 201 Created)

**Example Response:**

```json
{
    "id": "e743e219-3b61-4d1e-98f4-382ee65be0cb",
    "user": "068a9f5f-22c1-4149-9b54-33fbac32e6a7",
    "mood": {
        "id": "f9e41069-1dcb-4f29-a261-abff2ff2adbd",
        "name": "Surprised",
        "emoji": "😲",
        "category": "neutral"
    },
    "note": "This is a new note created with the refactored API.",
    "created_at": "2025-06-13T15:30:52.509487Z",
    "updated_at": "2025-06-13T15:30:52.509513Z"
}
```

**Notes:**
- The response returns the created object directly.
- `user` is the UUID.
- `mood` is a nested object.
- Field names match the model.

#### 2.2. Error Responses

**HTTP 400 Bad Request**  
Validation errors or incorrect data.

- **Missing `user_id`:**

    **Request:**
    ```json
    {
        "mood_name": "happy",
        "note": "This is a test note without user_id."
    }
    ```
    **Response:**
    ```json
    {
        "user_id": ["This field is required."]
    }
    ```

- **Invalid `user_id` format:**

    **Request:**
    ```json
    {
        "user_id": "NOT-A-VALID-UUID",
        "mood_name": "happy",
        "note": "This is a test note with an invalid user_id format."
    }
    ```
    **Response:**
    ```json
    {
        "user_id": ["Must be a valid UUID."]
    }
    ```

- **Non-existent `user_id`:**

    **Request:**
    ```json
    {
        "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "mood_name": "happy",
        "note": "This is a test note with a non-existent user_id."
    }
    ```
    **Response:**
    ```json
    {
        "user_id": "Invalid or non-existent user_id."
    }
    ```

- **Invalid JSON:**

    **Request:** (malformed)
    ```json
    {"user_id": "...", "mood_name": "...", "note": "..." // Malformed JSON
    ```
    **Response:**
    ```json
    {
        "detail": "JSON parse error - Expecting property name enclosed in double quotes: line 1 column 2 (char 1)"
    }
    ```

- **Mood not found:**

    **Request:**
    ```json
    {
        "user_id": "YOUR_VALID_USER_UUID_HERE",
        "mood_name": "hppy",
        "note": "This is a test note with a misspelled mood."
    }
    ```
    **Response:**
    ```json
    {
        "mood": "Mood 'hppy' not found."
    }
    ```

**HTTP 405 Method Not Allowed**  
If a method other than POST is used.

**Example:**
```json
{
    "detail": "Method \"GET\" not allowed."
}
```

**HTTP 500 Internal Server Error**  
Unexpected server-side errors.

**Example:**
```json
{
    "detail": "A server error occurred."
}
```

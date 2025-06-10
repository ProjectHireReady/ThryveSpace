# Notes API Documentation

This document outlines the usage of the API endpoint for creating and managing notes.

---

## 1. Create a New Note Entry

**Endpoint:** `POST /api/v1/notes/`

**Description:**
This endpoint allows clients (e.g., the frontend application) to submit a new note entry. The entry is linked to a specific user and can optionally be associated with a mood. The data is persisted to the database.

### Request

-   **Method:** `POST`
-   **URL:** `http://localhost:8000/api/v1/notes/`
-   **Headers:**
    -   `Content-Type: application/json`

**Body (JSON):**

| Field     | Type     | Required | Description                                               | Example                                     |
| :-------- | :------- | :------- | :-------------------------------------------------------- | :------------------------------------------ |
| `user_id` | `string` | Yes      | The UUID of the user creating the note entry.             | `"a1b2c3d4-e5f6-7890-1234-567890abcdef"`    |
| `mood`    | `string` | No       | The name of the mood associated with the note (e.g., "happy", "sad"). Must exist in the `Mood` database table. | `"happy"`                                   |
| `note`    | `string` | Yes      | The actual content/text of the note entry.                | `"Today was a productive day, feeling grateful."` |

**Example Request Body:**

```json
{
    "user_id": "YOUR_USER_UUID_HERE",
    "mood": "happy",
    "note": "This is a note entry about a happy day!"
}


---

#### Inside the "2.1. Success Response (HTTP 201 Created)" section:

Replace the "Example Success Response" with this:

```markdown
**Example Success Response:**

```json
{
    "message": "Note saved successfully!",
    "data": {
        "id": "e79c3bbe-7a07-45d5-90d5-2feb055203b2",
        "user_id": "YOUR_USER_UUID_HERE",
        "mood": "Happy",
        "content": "This is a note entry saved to the database!",
        "created_at": "2025-06-09T17:36:57.253022+00:00",
        "updated_at": "2025-06-09T17:36:57.253061+00:00"
    }
}

---

#### Replace the entire "2.2. Error Responses" section with this updated content:

```markdown
#### 2.2. Error Responses

**HTTP 400 Bad Request:**

Occurs for various validation failures or incorrect data.

-   **Missing `user_id`:**
    * **Request Body Example:**
        ```json
        {
            "mood": "happy",
            "note": "This is a test note without user_id."
        }
        ```
    * **Response Body Example:**
        ```json
        {
            "error": "user_id is required."
        }
        ```

-   **Invalid or Non-existent `user_id`:**
    * **Request Body Example:**
        ```json
        {
            "user_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "mood": "happy",
            "note": "This is a test note with an invalid user_id."
        }
        ```
    * **Response Body Example:**
        ```json
        {
            "error": "Invalid or non-existent user_id."
        }
        ```

-   **Invalid JSON in request body:**
    * **Request Body Example:**
        ```
        {"user_id": "...", "mood": "...", "note": "..." // Malformed JSON
        ```
    * **Response Body Example:**
        ```json
        {
            "error": "Invalid JSON in request body."
        }
        ```

-   **Mood not found:**
    * **Request Body Example:**
        ```json
        {
            "user_id": "YOUR_VALID_USER_UUID_HERE",
            "mood": "hppy",
            "note": "This is a test note with a misspelled mood."
        }
        ```
    * **Response Body Example:**
        ```json
        {
            "error": "Mood 'hppy' not found."
        }
        ```

**HTTP 405 Method Not Allowed:**

Occurs if an HTTP method other than `POST` is used on this endpoint.

-   **Example Response (e.g., for a `GET` request to `/api/v1/notes/`):**
    ```json
    {
        "error": "Method not allowed."
    }
    ```

**HTTP 500 Internal Server Error:**

Occurs for unexpected server-side errors during processing.

-   **Example Response:**
    ```json
    {
        "error": "An unexpected error occurred while saving: [details of error]"
    }
    ```
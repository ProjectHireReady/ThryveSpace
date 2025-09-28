# Moods API Documentation

This document describes the API endpoint for fetching moods and their categories.

---

## 1. Get All Moods and Categories

**Endpoint:**  
`GET /api/v1/moods/`

**Description:**  
Returns a comprehensive list of all available and **active** moods and their corresponding categories. This endpoint serves as the single source of truth for the frontend to dynamically display mood options. It utilizes ETag and Cache-Control headers for efficient caching.

### Request

- **Method:** `GET`
- **URL:** `http://localhost:8000/api/v1/moods/`
- **Headers:**
    - `If-None-Match: <ETag_value>` (Optional)  
        If provided, the server checks if the data has changed since the last request.

### Responses

#### 200 OK

Returns a JSON object containing two main arrays: `categories` and `moods`.

<details>
<summary>Example JSON Response</summary>

```json
{
    "categories": [
        {
            "value": "very negative",
            "label": "Very Negative",
            "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757660403/Lonely_bfgeld.svg"
        }
        // ... other categories
    ],
    "moods": [
        {
            "id": "f959b159-8c8e-4de5-a075-6397b96bd4db",
            "name": "Happy",
            "emoji": "😃",
            "category": "positive",
            "icon": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757659647/Happy_km0lhv.svg"
        }
        // ... other moods
    ]
}
```
</details>

#### Categories

A list of objects, each describing a mood category.

| Field | Type | Description |
|-------|------|-------------|
| value | String | The system value for the category (e.g., `"positive"`). |
| label | String | The human-readable label (e.g., `"Positive"`). |
| icon  | URL String | The URL for the category's icon/image. |

#### Moods

A list of objects, each representing an individual mood.

| Field    | Type        | Description |
|----------|-------------|-------------|
| id       | UUID String | The unique identifier for the mood. |
| name     | String      | The name of the mood (e.g., `"Happy"`). |
| emoji    | String      | The emoji character associated with the mood. |
| category | String      | The category value this mood belongs to (e.g., `"positive"`). |
| icon     | URL String  | The URL for the mood's visual illustration. |

#### Response Headers (Caching)

- **ETag:**  
    A unique identifier for the current state of the resource. The ETag is generated based on the latest `updated_at` timestamp of both the Mood and MoodCategory models.

- **Cache-Control:**  
    `public, max-age=86400, must-revalidate`  
    Instructs the client to cache the response for 24 hours (86,400 seconds) and revalidate with the server afterward.

- **Last-Modified:**  
    The timestamp of the most recent change to any relevant model.

---

## 2. Caching Response

### 304 Not Modified

If a client sends a GET request with an `If-None-Match` header that matches the current ETag of the resource, the server returns a **304 Not Modified** status.

- **Description:**  
    Indicates that the client's cached version of the data is still up to date. This is handled by Django's `@condition` decorator.

- **Response Body:**  
    Empty

- **Benefit:**  
    Saves bandwidth and reduces latency by avoiding retransmission of data the client already has.

---

**CORS Note:**  
The header `If-None-Match` is allowed for cross-origin requests by explicitly including `"if-none-match"` in the `CORS_ALLOW_HEADERS` setting.
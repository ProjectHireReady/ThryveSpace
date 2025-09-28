# Moods API Documentation

This document describes the API endpoint for fetching moods and their categories.

---

## 1. Get All Moods and Categories

**Endpoint:**  
`GET /api/v1/moods/`

**Description:**  
Provides a comprehensive list of all available moods and their corresponding categories. Designed as the single source of truth for the frontend to dynamically display mood options.

---

### Request

- **Method:** `GET`
- **URL:** `http://localhost:8000/api/v1/moods/`
- **Headers:**
    - `If-None-Match: <ETag_value>` (Optional)  
        If the client includes a valid ETag from a previous request, the server will check if the data has changed since.

---

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
            "icon_url": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757660403/Lonely_bfgeld.svg"
        }
        // ... other categories
    ],
    "moods": [
        {
            "id": "f959b159-8c8e-4de5-a075-6397b96bd4db",
            "name": "Happy",
            "emoji": "😃",
            "category": "positive",
            "image_url": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757659647/Happy_km0lhv.svg"
        }
        // ... other moods
    ]
}
```
</details>

- **categories:**  
    A list of objects, each describing a mood category.

- **moods:**  
    A list of objects, each representing an individual mood with its associated emoji, category, and image URL.

**Response Headers:**

- `ETag`: A unique identifier for the current state of the resource. The frontend should store this value.
- `Cache-Control`: `public, max-age=86400, must-revalidate`  
    Instructs the client to cache the response for 24 hours (86,400 seconds) and re-validate with the server afterward.

---

### 3. Caching Response

#### 304 Not Modified

If a client sends a GET request with an `If-None-Match` header that matches the current ETag of the resource, the server returns a `304 Not Modified` status.

- **Description:**  
    Indicates that the client's cached version of the data is still up to date.

- **Response Body:**  
    _Empty_

- **Benefit:**  
    Saves bandwidth and reduces latency by avoiding the re-transmission of data that the client already has.

---
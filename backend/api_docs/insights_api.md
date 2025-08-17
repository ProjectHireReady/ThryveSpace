# Insights API Documentation

This document describes the API endpoints for retrieving weekly mood history and a rule-based mood tip.

---

## 1) Get Weekly Mood History

**Endpoint:** `GET /api/v1/insights/history/`  
**Description:** Returns 7 days (Mon–Sun) of data for a selected week window: a graph-friendly array and a timeline list.

### Request

- **Method:** `GET`
- **Headers:**
  - `Authorization: Token <TOKEN>`

**Query Parameters:**

| Param         | Type | Required | Description                                                    | Example |
| :------------ | :--- | :------- | :------------------------------------------------------------- | :------ |
| `week_offset` | int  | No       | `0` = current week, `1` = previous week, etc. Defaults to `0`. | `0`     |
| `week`        | int  | No       | Alias for `week_offset`.                                       | `1`     |

### Response (HTTP 200 OK)

```json
{
  "week_start": "2025-08-11",
  "week_end": "2025-08-17",
  "graph": [
    { "date": "2025-08-11", "mood_value": 4 },
    { "date": "2025-08-12", "mood_value": null },
    { "date": "2025-08-13", "mood_value": 2 }
  ],
  "timeline": [
    /* Items serialized via NoteInsightSerializer */
  ]
}
```

### Notes:

- **mood_value mapping:** very negative=1, negative=2, neutral=3, positive=4, very positive=5.
- **Timeline items** use NoteInsightSerializer (see notes/serializers.py).
- Weeks are Monday–Sunday, based on server TZ (e.g., Africa/Nairobi).

### Postman

**Environment vars**

- `baseUrl` = `http://localhost:8000` (or your server)
- `token` = your DRF token

**Auth header**

- Key: `Authorization`
- Value: `Token {{token}}`

**History request**

- Method: GET
- URL: `{{baseUrl}}/api/v1/insights/history/`
- Params: `week_offset=0`

**Tip request**

- Method: GET
- URL: `{{baseUrl}}/api/v1/insights/tip/`
- Params: `week_offset=0`

**Quick tests (Postman → Tests)**

```js
// History
pm.test("200 OK", () => pm.response.code === 200);
const body = pm.response.json();
pm.test("has week fields", () => body.week_start && body.week_end);
pm.test(
  "graph has 7 items",
  () => Array.isArray(body.graph) && body.graph.length === 7
);
pm.test("timeline is array", () => Array.isArray(body.timeline));
```

## 2) Get Weekly Mood Tip

**Endpoint:** GET /api/v1/insights/tip/
**Description:**
Returns a single rule-based tip { "type": "tip", "message": "..." } for the same 7-day window.

### Request

- **Method:** GET

- **Headers:**

- [] - Authorization: Token <TOKEN>

### Query Parameters:

| Param         | Type | Required | Description                                                    | Example |
| :------------ | :--- | :------- | :------------------------------------------------------------- | :------ |
| `week_offset` | int  | No       | `0` = current week, `1` = previous week, etc. Defaults to `0`. | `0`     |
| `week`        | int  | No       | Alias for `week_offset`.                                       | `1`     |

### Response (HTTP 200 OK)

{ "type": "tip", "message": "Nice upward trend! Double down on what helped—note one thing that lifted your mood." }

**Rule Priority (deterministic):**

1. 3+ consecutive days of same low mood → grounding/rest tip

2. Weekly trend: decline ≤ −0.6 or rise ≥ +0.6 → tuning/encouragement tip

3. Low engagement: ≥3 missing days → gentle re-engagement tip

4. Default gentle check-in

### Postman

**Tip request**

- Method: GET

- URL: {{baseUrl}}/api/v1/insights/tip/

- Params: week_offset=0

**Quick tests (Postman → Tests)**

```js
pm.test("200 OK", () => pm.response.code === 200);
const body = pm.response.json();
pm.test(
  "tip shape",
  () =>
    body.type === "tip" &&
    typeof body.message === "string" &&
    body.message.length > 0
);
```

### Errors

- **401/403** — Missing or invalid token.

- **Invalid** week_offset — Treated as 0 (no error thrown).

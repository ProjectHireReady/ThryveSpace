## 1) Get Weekly Mood History

**Endpoint:** `GET /api/v1/insights/history/`  
**Description:** Returns 7 days (Mon–Sun) of data: a graph array (always 7 points) and a timeline (only days with notes).

### Request

- **Headers:** `Authorization: Token <TOKEN>`
- **Query:**
  - `week_offset` (int, optional, default `0`) — `0=this week`, `1=last week`, ...
  - `week` (int, optional) — alias for `week_offset`

### Response (200)

```json
{
  "week": { "start": "2025-08-11", "end": "2025-08-17" },
  "graph": [
    { "date": "2025-08-11", "mood_value": 4, "mood_id": 10 },
    { "date": "2025-08-12", "mood_value": null, "mood_id": null },
    { "date": "2025-08-13", "mood_value": 2, "mood_id": 7 },
    { "date": "2025-08-14", "mood_value": 5, "mood_id": 12 },
    { "date": "2025-08-15", "mood_value": 3, "mood_id": 7 },
    { "date": "2025-08-16", "mood_value": 2, "mood_id": 11 },
    { "date": "2025-08-17", "mood_value": 2, "mood_id": 11 }
  ],
  "timeline": [
    {
      "date": "2025-08-11",
      "mood_value": 4,
      "mood_id": 10,
      "snippet": "Evening walk helped me unwind."
    },
    {
      "date": "2025-08-13",
      "mood_value": 2,
      "mood_id": 7,
      "snippet": "Busy day but manageable."
    }
  ]
}
```

### Notes:

- week.end is **inclusive** (Sunday).
- graph always has 7 entries (Mon→Sun). Missing days → mood_value: null, mood_id: null.
- timeline.snippet is trimmed to ≤120 chars.
- **Validation:** /insights/history returns **400** for negative or non-integer week_offset.

### Postman

```js
pm.test("200 OK", () => pm.response.code === 200);
const b = pm.response.json();
pm.test("week has start/end", () => b.week && b.week.start && b.week.end);
pm.test(
  "graph has 7 items",
  () => Array.isArray(b.graph) && b.graph.length === 7
);
pm.test("graph items include mood_id", () =>
  b.graph.every((p) => "mood_id" in p)
);
pm.test("timeline is array", () => Array.isArray(b.timeline));
```

## 2) Get Weekly Mood Tip

**Endpoint:** GET /api/v1/insights/tip/
**Description:**
Returns a single rule-based tip { "type": "tip", "message": "..." } for the same 7-day window.

### Request

- **Headers:** Authorization: Token <TOKEN>
- **Query:** week_offset (or week alias).
  Invalid/negative values are **treated as 0** (no error) for this endpoint.

### Response (HTTP 200 OK)

```json
{
  "type": "tip",
  "message": "Nice upward trend! Double down on what helped—note one thing that lifted your mood."
}
```

### Postman Tests

```js
pm.test("200 OK", () => pm.response.code === 200);
const t = pm.response.json();
pm.test(
  "tip shape",
  () =>
    t.type === "tip" && typeof t.message === "string" && t.message.length > 0
);
```

### Errors

- 01/403 — Missing or invalid token.
- /insights/history: 400 on invalid/negative week_offset.
- /insights/tip: invalid/negative week is treated as 0.

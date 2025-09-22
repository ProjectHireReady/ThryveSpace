# AI Prompt Versioning

Every AI-generated message response includes a `prompt_version` field.

Example:

```json
{
  "message": "You're doing great!",
  "prompt_version": "v1"
}

**Affected Endpoints:**

- /api/guest/encourage

- /api/kindness/messages

- /api/insights/ai-messages
```

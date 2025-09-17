### 📬 POST /api/v1/contact/

Submit a contact message from the website or app.

#### ✅ Request Body (JSON)
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I'd love to learn more about ThryveSpace."
}
```
### ✅ Response (Success)
```json
{
  "ok": true,
  "message": "Thanks for reaching out! We’ve received your message."
}
```
### ❌ Response (Validation error)
```json
{
  "ok": false,
  "errors": {
    "email": ["Enter a valid email address."],
    "message": ["Please provide a bit more detail (min ~10 chars)."]
  }
}
```
### ⏳ Response (Rate-limited)
```json
{
  "detail": "Request was throttled. Expected available in 3600 seconds."
}
```


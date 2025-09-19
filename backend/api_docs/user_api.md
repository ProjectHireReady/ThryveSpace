## 1. 👤 GET /api/v1/auth/me/

### Retrieve the authenticated user’s profile details.

- Requires a valid authentication token.


## 2. ✏️ PATCH /api/v1/auth/me/

### Update the authenticated user’s profile details.
- Only first_name and last_name can be updated.

```✅ Request Body (JSON)
{
  "last_name": "Doe"
}
#### ✅ Request Body (JSON)
{
  "last_name": "Doe"
}

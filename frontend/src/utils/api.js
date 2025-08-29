// api.js

/**
 * POST guest entries to the migration endpoint.
 * Expects an array of entry objects shaped for your backend, e.g.:
 * [{ note: string, mood_id: number, created_at?: string }, ...]
 *
 * @param {Array<Object>} guestEntries - payload already mapped in the caller
 * @param {string} token - auth token (e.g., DRF Token)
 * @returns {Promise<Object>} parsed JSON response
 * @throws Error on network failure or non-2xx response
 */
export async function migrateGuestEntries(guestEntries, token) {
  try {
    const response = await fetch("/api/migrate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Token ${token}` } : {}),
      },
      body: JSON.stringify({ entries: guestEntries }),
    });

    // Read response body once (as text), then safely parse JSON
    const text = await response.text().catch(() => "");

    if (!response.ok) {
      // Try to surface useful backend error details
      let details = "";
      try {
        const json = text ? JSON.parse(text) : {};
        details =
          json?.detail || json?.error
            ? JSON.stringify(json)
            : text || response.statusText;
      } catch {
        details = text || response.statusText;
      }
      throw new Error(`Migration failed: ${response.status} ${details}`);
    }

    // Safely parse JSON (backend may return empty body)
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      // If non-JSON, return raw text for debugging
      return { raw: text };
    }
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  }
}

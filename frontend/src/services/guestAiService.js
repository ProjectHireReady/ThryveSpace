export async function requestGuestAI({ guest_id, mood_name, note_snippet }) {
    try {
        const trimmedSnippet = (note_snippet || "").slice(0, 300);

        const response = await fetch("/guest/encourage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guest_id, mood_name, note_snippet: trimmedSnippet }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Guest kindness AI failed:", err);
        return { detail: "error" }; // fallback
    }
}

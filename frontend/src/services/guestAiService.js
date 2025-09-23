import axios from "../lib/axiosInstance";

export async function requestGuestAI({ guest_id, mood_name, note_snippet }) {
  try {
    const trimmedSnippet = (note_snippet || "").slice(0, 300);

    const response = await axios.post(
      "/guest/encourage",
      {
        guest_id,
        mood_name,
        note_snippet: trimmedSnippet,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data; // axios auto-parses JSON
  } catch (err) {
    console.error("Guest kindness AI failed:", err);
    return { detail: "error" }; // fallback
  }
}

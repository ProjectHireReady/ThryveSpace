// src/services/guestAiService.js
import axios from "../lib/axiosInstance";

export async function requestGuestAI({ guest_id, mood_name, note_snippet }) {
  try {
    // Centralize trimming logic 
    const trimmedSnippet = (note_snippet || "").slice(0, 300);

    const response = await axios.post("/insights/guest/encourage", {
      guest_id,
      mood_name,
      note_snippet: trimmedSnippet,
    });

    return response.data; 
  } catch (err) {
    console.error("Guest kindness AI failed:", err);
    return null; 
  }
}

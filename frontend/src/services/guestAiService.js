// src/services/guestAiService.js
import axiosInstance from "../lib/axiosInstance";
import { getOrCreateGuestId } from "../utils/guestUtils";

/**
 * Sends a guest note to the AI kindness backend safely.
 * Ensures required fields are always present.
 *
 * @param {Object} params
 * @param {string|null} params.mood_name - optional mood name
 * @param {string|null} params.note_snippet - note content
 * @returns {Object|null} backend response or null on failure
 */
export async function requestGuestAI({ mood_name = null, note_snippet = "" }) {
  try {
    const guestId = getOrCreateGuestId();

    // Guarantee non-empty snippet and max length
    const snippet = (note_snippet || "You're doing great ❤️").slice(0, 300);
    const moodName = mood_name || null;

    const payload = {
      fingerprint: guestId, // required by backend
      note: snippet,        // required by backend
      mood_name: moodName,  // optional
    };

    console.log("Sending Guest AI payload:", payload);

    const { data } = await axiosInstance.post("/insights/guest/encourage/", payload);
    return data;
  } catch (err) {
    console.error(
      "Guest kindness AI failed:",
      err.response?.data || err.message || err
    );
    return null; // fallback if backend fails
  }
}

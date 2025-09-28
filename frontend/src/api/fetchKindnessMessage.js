import axiosInstance from "../lib/axiosInstance";
import { USE_AI_KINDNESS, API_ENDPOINTS } from "../config";

/**
 * Fetches kindness message from backend.
 * Logs payloads, endpoint, and response.
 */
export const fetchKindnessMessage = async (
  snippet = "",
  mood_name = null,
  note_id = null
) => {
  console.log("=== fetchKindnessMessage called ===");
  console.log("USE_AI_KINDNESS:", USE_AI_KINDNESS);
  console.log("Snippet:", snippet);
  console.log("Mood name:", mood_name);
  console.log("Note ID:", note_id);

  try {
    if (USE_AI_KINDNESS) {
      console.log("Calling AI endpoint:", API_ENDPOINTS.kindnessAI);

      const payload = {
        snippet,
        mood_name,
        note_id, // include note_id for backend
      };

      console.log("Payload sent to AI endpoint:", payload);

      const { data } = await axiosInstance.post(API_ENDPOINTS.kindnessAI, payload);
      console.log("AI endpoint response:", data);

      return data.message || null;
    } else {
      console.log("Calling rule-based endpoint:", API_ENDPOINTS.kindnessRule);
      const { data } = await axiosInstance.get(API_ENDPOINTS.kindnessRule);
      console.log("Rule-based endpoint response:", data);
      return data.no_message ? null : data.message || null;
    }
  } catch (err) {
    console.error(
      "Error fetching kindness message:",
      err.response?.data || err.message
    );
    return null; // fallback
  }
};

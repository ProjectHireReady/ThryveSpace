// src/api/fetchKindnessMessage.js
import axiosInstance from "../lib/axiosInstance";
import { USE_AI_KINDNESS, API_ENDPOINTS } from "../config";

export const fetchKindnessMessage = async (snippet = "", mood_name = null) => {
  try {
    if (USE_AI_KINDNESS) {
      const { data } = await axiosInstance.post(API_ENDPOINTS.kindnessAI, {
        snippet,
        mood_name,
      });
      return data.message || null;
    } else {
      const { data } = await axiosInstance.get(API_ENDPOINTS.kindnessRule);
      return data.no_message ? null : data.message || null;
    }
  } catch (err) {
    console.error(
      "Error fetching kindness message:",
      err.response?.data || err.message
    );
    return null; // silent fail (fallback will show instead)
  }
};

// src/utils/loggedInKindness.js
import { fetchKindnessMessage } from "../api/fetchKindnessMessage";
import { USE_AI_KINDNESS, MIN_ENTRIES_BEFORE_KINDNESS } from "../config";

/**
 * Handle showing kindness message after saving an entry.
 * AI: sends snippet and mood_name (max 400 chars snippet)
 * Rule-based: requires minimum entries before asking backend
 */
export const handleLoggedInKindness = async (
  aiPayload,
  totalEntries,
  setKindnessMessage,
  aiFlag
) => {
  if (!aiPayload) return;

  // Rule-based: wait until user has at least MIN_ENTRIES_BEFORE_KINDNESS
  if (!USE_AI_KINDNESS && totalEntries < MIN_ENTRIES_BEFORE_KINDNESS) return;

  // AI: respect backend flag
  if (USE_AI_KINDNESS && !aiFlag) return;

  // Fetch kindness message
  const message = await fetchKindnessMessage(
    aiPayload.snippet,
    aiPayload.mood_name
  );

  if (message) setKindnessMessage(message);
};
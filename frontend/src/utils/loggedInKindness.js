import { fetchKindnessMessage } from "../api/fetchKindnessMessage";
import { USE_AI_KINDNESS, MIN_ENTRIES_BEFORE_KINDNESS } from "../config";

/**
 * Handle showing kindness message after saving an entry.
 * AI: sends snippet of latest note (max 400 chars)
 * Rule-based: requires minimum entries before asking backend
 */
export const handleLoggedInKindness = async (latestEntry, totalEntries, setKindnessMessage) => {
  if (!latestEntry) return;

  // Rule-based: wait until user has at least MIN_ENTRIES_BEFORE_KINDNESS
  if (!USE_AI_KINDNESS && totalEntries < MIN_ENTRIES_BEFORE_KINDNESS) return;

  // Take the first 400 chars of the note for AI
  const latestNote = latestEntry.note || "";
  const snippet = latestNote.slice(0, 400);

  // Fetch message and update the frontend
  const message = await fetchKindnessMessage(snippet);
  if (message) setKindnessMessage(message);
};

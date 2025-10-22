import { fetchKindnessMessage } from "../api/fetchKindnessMessage";
import { USE_AI_KINDNESS, MIN_ENTRIES_BEFORE_KINDNESS } from "../config";

/**
 * Handle showing kindness message after saving an entry.
 * Builds payload, logs, and fetches kindness.
 */
export const handleLoggedInKindness = async ({
  entry,
  mood,
  response,
  totalEntries,
  setKindnessMessage,
  navigate,
  onSubmit,
  // forceAi = false, // mock test flag
}) => {
  console.log("=== handleLoggedInKindness called ===");
  console.log("Raw entry:", entry);
  console.log("Mood object:", mood);
  console.log("Backend response:", response);
  console.log("Total entries:", totalEntries);

  const noteId = response?.id;
  const aiFlag = response?.message || false;
  // const aiFlag = forceAi || response?.message || false; // To test backend flag

  const aiPayload = {
    snippet: entry.slice(0, 400),
    mood_name: mood?.name || null,
    note_id: noteId,
  };

  console.log("Built AI payload:", aiPayload);
  console.log("AI flag:", aiFlag);
  console.log("USE_AI_KINDNESS:", USE_AI_KINDNESS);
  console.log("MIN_ENTRIES_BEFORE_KINDNESS:", MIN_ENTRIES_BEFORE_KINDNESS);

  if (!aiPayload.snippet) {
    console.log("No snippet to send. Skipping kindness fetch.");
    return;
  }

  if (!USE_AI_KINDNESS && totalEntries < MIN_ENTRIES_BEFORE_KINDNESS) {
    console.log(
      `Skipping rule-based kindness: need ${MIN_ENTRIES_BEFORE_KINDNESS}, have ${totalEntries}`
    );
    return;
  }

  if (USE_AI_KINDNESS && !aiFlag) {
    console.log("AI flag false; skipping AI kindness");
    return;
  }

  try {
    console.log("Fetching kindness message with payload:", aiPayload);

    const message = await fetchKindnessMessage(
      aiPayload.snippet,
      aiPayload.mood_name,
      aiPayload.note_id
    );

    console.log("Kindness message received from backend:", message);

    if (message) {
      setKindnessMessage(message);
      console.log("Kindness message set in state.");

      // navigate after short delay 
      setTimeout(() => {
        console.log("Navigating to /entries after kindness delay");
        onSubmit?.(); // close modal in parent
        navigate("/entries");
      }, 3000);
    } else {
      console.log("No message returned from backend.");
      setTimeout(() => {
        console.log("Navigating to /entries if after delay no message");
        onSubmit?.(); // close modal in parent
        navigate("/entries");
      }, 2000);
    }
  } catch (err) {
    console.error("Error in handleLoggedInKindness:", err);
  }
};

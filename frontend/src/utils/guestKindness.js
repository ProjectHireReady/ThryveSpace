import {
  shouldShowKindness,
  markKindnessShown,
  shouldShowLoginPrompt,
  markLoginPromptShown,
} from "./localStorageUtils";
import { requestGuestAI } from "../services/guestAiService";
import { getOrCreateGuestId } from "./guestUtils";

export const handleGuestKindness = async (
  navigate,
  onSubmit,
  setShowKindness,
  setShowLoginPrompt,
  setKindnessMessage,
  entry,
  mood
) => {
  if (!shouldShowKindness()) {
    // Kindness already shown before, still handle navigation
    if (shouldShowLoginPrompt()) {
      setShowLoginPrompt(true);
      markLoginPromptShown();
    } else {
      onSubmit?.();
      navigate("/entries");
    }
    return;
  }

  // Attempt AI kindness fetch
  let message = null;
  try {
    const guest_id = getOrCreateGuestId();
    const note_snippet = entry; //  service handles trimming
    const mood_name = mood?.name || null;

    const result = await requestGuestAI({ guest_id, mood_name, note_snippet });

    if (result.message) {
      message = result.message;
    }
  } catch (err) {
    console.error("Guest kindness AI failed:", err);
  }

  // Show kindness (AI or fallback static)
  setKindnessMessage(message || "You’re doing great ❤️");
  setShowKindness(true);
  markKindnessShown();

  setTimeout(() => {
    setShowKindness(false);

    if (shouldShowLoginPrompt()) {
      setShowLoginPrompt(true);
      markLoginPromptShown();
    } else {
      onSubmit?.();
      navigate("/entries");
    }
  }, 3000);
};
// utils/guestKindness.js
import {
  shouldShowKindness,
  markKindnessShown,
  shouldShowLoginPrompt,
  markLoginPromptShown,
} from "./localStorageUtils";
import { requestGuestAI } from "../services/guestAiService";
import { getOrCreateGuestId } from "./guestUtils";

/**
 * Handles showing kindness messages for guest users after submitting a note.
 *
 * @param {Function} navigate - react-router navigation function
 * @param {Function} onSubmit - optional callback after submission
 * @param {Function} setShowKindness - state setter to show kindness UI
 * @param {Function} setShowLoginPrompt - state setter to show login prompt
 * @param {Function} setKindnessMessage - state setter for kindness message
 * @param {string} entry - the note content
 * @param {Object|null} mood - optional mood object
 */
export const handleGuestKindness = async (
  navigate,
  onSubmit,
  setShowKindness,
  setShowLoginPrompt,
  setKindnessMessage,
  entry,
  mood
) => {
  const showLoginPrompt = shouldShowLoginPrompt();

  // If kindness should not be shown at all
  if (!shouldShowKindness()) {
    if (showLoginPrompt) {
      setShowLoginPrompt(true);
      markLoginPromptShown();
    } else {
      onSubmit?.();
      navigate("/entries");
    }
    return;
  }

  // Default message in case AI fails
  let message = "You’re doing great ❤️";

  try {
    const guestId = getOrCreateGuestId();
    const trimmedNote = (entry || "").slice(0, 300);

    const payload = {
      fingerprint: guestId,
      note: trimmedNote,
      mood_name: mood?.name || null,
    };

    console.log("Sending Guest AI payload:", payload);

    const result = await requestGuestAI(payload);
    if (result?.message) message = result.message;
  } catch (err) {
    console.error(
      "Guest kindness AI failed:",
      err.response?.data || err.message || err
    );
  }

  // Show the kindness message
  setKindnessMessage(message);
  setShowKindness(true);
  markKindnessShown();

  // Hide kindness message after a short delay and proceed
  setTimeout(() => {
    setShowKindness(false);

    if (showLoginPrompt) {
      setShowLoginPrompt(true);
      markLoginPromptShown();
    } else {
      onSubmit?.();
      navigate("/entries");
    }
  }, 3000);
};

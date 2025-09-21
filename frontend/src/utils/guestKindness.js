import {
  shouldShowKindness,
  markKindnessShown,
  shouldShowLoginPrompt,
  markLoginPromptShown,
} from "./localStorageUtils";

export const handleGuestKindness = (
  navigate,
  onSubmit,
  setShowKindness,
  setShowLoginPrompt
) => {
  if (!shouldShowKindness()) {
    // Kindness already shown before, still handle navigation
    if (shouldShowLoginPrompt()) {
      setShowLoginPrompt(true);
      markLoginPromptShown();
    } else {
      // Fallback: go directly to entries
      onSubmit?.();
      navigate("/entries");
    }
    return;
  }

  // Kindness path (first time)
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

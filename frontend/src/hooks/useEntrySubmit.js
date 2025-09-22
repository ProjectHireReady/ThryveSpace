import { useState } from "react";
import { formatGuestPayload } from "../utils/guestUtils";
import { handleGuestKindness } from "../utils/guestKindness";
import { handleLoggedInKindness } from "../utils/loggedInKindness";

// Custom hook that manages entry state and submission logic
export default function useEntrySubmit({
  mood,
  onSubmit,
  isLoggedIn,
  addEntry,
  entries,
  navigate,
}) {
  // Local input states
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // States for kindness/login messages
  const [showKindness, setShowKindness] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [kindnessMessage, setKindnessMessage] = useState(null);

  const handleSubmit = async () => {
    // Require either entry text OR mood (title alone is not enough)
    if (!entry.trim() && !mood) return;

    // Build payload (different for guest vs logged-in)
    const payload = isLoggedIn
      ? {
        title: title.trim() || null,
        note: entry.trim(),
        mood_id: mood?.id || null,
      }
      : formatGuestPayload(entry, mood, title);

    try {
      setSubmitting(true);

      // Save entry
      const response = await addEntry(payload);
      setEntry("");
      setTitle("");

      if (isLoggedIn) {
        // Count entries after this one
        const totalEntries = entries.length + 1;

        // AI may send a special message flag
        const aiFlag = response?.message || false;

        // Build AI payload for kindness
        const aiPayload = {
          snippet: entry.slice(0, 400),
          mood_name: mood?.name || null,
        };

        // Handle kindness (AI or fallback)
        await handleLoggedInKindness(
          aiPayload,
          totalEntries,
          setKindnessMessage,
          aiFlag
        );

        // Navigate after short delay (to let kindness show)
        setTimeout(() => navigate("/entries"), 2000);
      } else {
        // Guest flow (with AI kindness)
        await handleGuestKindness(
          navigate,
          onSubmit,
          setShowKindness,
          setShowLoginPrompt,
          setKindnessMessage,
          entry,
          mood
        );
      }
    } catch (err) {
      console.error(
        "Error saving entry:",
        err.response?.data || err.message || err
      );
      alert("Could not save your note. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    entry,
    setEntry,
    submitting,
    handleSubmit,
    showKindness,
    showLoginPrompt,
    kindnessMessage,
  };
}

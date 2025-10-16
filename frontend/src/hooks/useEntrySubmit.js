import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatGuestPayload } from "../utils/guestUtils";
import { handleGuestKindness } from "../utils/guestKindness";
import { handleLoggedInKindness } from "../utils/loggedInKindness";

export default function useEntrySubmit({
  mood,
  onSubmit,
  isLoggedIn,
  addEntry,
  entries,
}) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showKindness, setShowKindness] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [kindnessMessage, setKindnessMessage] = useState(null);

  const handleSubmit = async () => {
    if (!entry.trim() && !mood) return;

    const payload = isLoggedIn
      ? { title: title.trim() || null, note: entry.trim(), mood_id: mood?.id || null }
      : formatGuestPayload(entry, mood, title);

    try {
      setSubmitting(true);
      const response = await addEntry(payload);

      setEntry("");
      setTitle("");

      if (isLoggedIn) {
        // Run kindness logic
        const message = await handleLoggedInKindness({
          entry,
          mood,
          response,
          totalEntries: entries.length + 1,
          setKindnessMessage,
          navigate,
        });

        // 🟢 If no kindness message was triggered, navigate immediately
        if (!message) onSubmit();

      } else {
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
      console.error("Error saving entry:", err);
      alert("Could not save your note.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    title, setTitle,
    entry, setEntry,
    submitting,
    handleSubmit,
    showKindness,
    showLoginPrompt,
    kindnessMessage,
    onLoginComplete: onSubmit,
  };
}

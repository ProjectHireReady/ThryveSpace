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

  // Local input states
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // States for kindness/login messages
  const [showKindness, setShowKindness] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [kindnessMessage, setKindnessMessage] = useState(null);

  const handleSubmit = async () => {
    if (!entry.trim() && !mood) {
      console.log("Nothing to submit: entry and mood empty");
      return;
    }

    const payload = isLoggedIn
      ? {
        title: title.trim() || null,
        note: entry.trim(),
        mood_id: mood?.id || null,
      }
      : formatGuestPayload(entry, mood, title);

    console.log("Submitting payload:", payload);

    try {
      setSubmitting(true);

      const response = await addEntry(payload); // saves note and returns backend response
      console.log("FULL response from addEntry:", response);

      setEntry("");
      setTitle("");

      if (isLoggedIn) {
        console.log("Handling logged-in kindness...");
        const message = await handleLoggedInKindness({
          entry,
          mood,
          response,
          totalEntries: entries.length + 1,
          setKindnessMessage,
          navigate,
        });

        // ✅ If no kindness message was triggered, navigate immediately
        if (!message) {
          console.log("No kindness message triggered, navigating to entries...");
          onSubmit();
        }
      } else {
        console.log("Handling guest kindness...");
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
    onLoginComplete: onSubmit,
  };
}

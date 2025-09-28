import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import here
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
    if (!entry.trim() && !mood) return;

    const payload = isLoggedIn
      ? {
          title: title.trim() || null,
          note: entry.trim(),
          mood_id: mood?.id || null,
        }
      : formatGuestPayload(entry, mood, title);

    try {
      setSubmitting(true);

      const response = await addEntry(payload);
      setEntry("");
      setTitle("");

      if (isLoggedIn) {
        const totalEntries = entries.length + 1;
        const aiFlag = response?.message || false;

        const aiPayload = {
          snippet: entry.slice(0, 400),
          mood_name: mood?.name || null,
        };

        await handleLoggedInKindness(
          aiPayload,
          totalEntries,
          setKindnessMessage,
          aiFlag
        );
        
        setTimeout(() => {
          navigate("/entries")
        }, 3000);

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

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Check, Trash } from "lucide-react";
import { useEntries } from "../context/EntriesContext";
import { formatGuestPayload } from "../utils/guestUtils";
import "./NewEntryForm.css";

export default function NewEntryForm({ mood, onSubmit }) {
  const { addEntry } = useEntries();
  const { isLoggedIn } = useAuth();

  const [entry, setEntry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Today's date
  const getToday = () => {
    const date = new Date();
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
    };
  };

  const { day, month } = getToday();

  const handleSubmit = async () => {
    // if (!entry.trim()) return alert("Please write something!");
    if (!entry.trim() && !mood) return alert("Please pick a mood or write something!");


    const payload = isLoggedIn
      ? { note: entry, mood_id: mood?.id || null }
      : formatGuestPayload(entry, mood);

    try {
      setSubmitting(true);
      await addEntry(payload);

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setEntry("");
        onSubmit?.();
      }, 2000);
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("Could not save your note. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-entry-page">
      <h1 className="new-entry-heading">Want to reflect more?</h1>

      <div className="new-entry-text">
        <p className="new-entry-subtext">Say how you feel in words.</p>
      </div>

      <div className="new-entry-container">
        {/* Date box */}
        <div className="new-entry-date">
          <div className="new-entry-day">{day}</div>
          <div className="new-entry-month">{month}</div>
        </div>

        <div className="new-entry-card">
          {/* Mood preview */}
          {mood && (
            <div className="new-entry-mood">
              <span className="new-entry-emoji">
                <img src={mood.imageUrl} alt={mood.name} />
              </span>
            </div>
          )}

          {/* Entry textarea */}
          <textarea
            className="new-entry-input"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="What’s on your mind today?"
            rows={1}
            disabled={submitting}
          />

          <div className="new-entry-footer">
            <button
              onClick={handleSubmit}
              className="new-entry-submit"
              aria-label="Submit Entry"
              disabled={submitting}
            >
              <Check size={20} />
            </button>

            <button
              onClick={() => setEntry("")}
              className="new-entry-delete"
              aria-label="Clear Entry"
              disabled={submitting}
            >
              <Trash size={20} />
            </button>
          </div>
        </div>
      </div>

      {showPopup ? (
        <div className="new-entry-popup">
          Thanks for sharing. Keep taking care of yourself.
        </div>
      ) : (
        <div className="new-entry-text">
          <p className="new-entry-footer-text">
            We listen gently once you have finished
          </p>
        </div>
      )}
    </div>
  );
}

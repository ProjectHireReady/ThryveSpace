// Imports
import KindnessMessage from "./KindnessMessage";
import LoginPrompt from "./LoginPrompt";
import { useState } from "react";
import { Check, Trash } from "lucide-react";
import { useEntries } from "../context/EntriesContext"; // Custom context to handle entries
import "./NewEntryForm.css";

// This component shows the journaling form after a mood is selected
export default function NewEntryForm({ mood, onSubmit }) {
  const { addEntry } = useEntries(); // Function to save a journal entry

  // Local state
  const [entry, setEntry] = useState(""); // User’s typed note
  const [submitting, setSubmitting] = useState(false); // To disable buttons while submitting
  const [showPopup, setShowPopup] = useState(false); // Controls success message

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);


  // Handle submit button click
  const handleSubmit = async () => {
    // Don’t submit if input is empty
    if (!entry.trim()) return alert("Please write something!");

    const payload = {
      mood_id: mood?.id || null,
      note: entry,
    };

    try {
      setSubmitting(true); // Start loading
      await addEntry(payload); // Save entry using context

      setShowPopup(true); // Show success message

      // After 2 seconds, hide popup, clear input, and close modal
      setTimeout(() => {
        setShowPopup(false);
        setEntry("");
        onSubmit?.(); // close the modal
      }, 2000);
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("Could not save your note. Please try again.");
    } finally {
      setSubmitting(false); // End loading
    }
  };

  // Get today’s day and month (formatted)
  const getToday = () => {
    const date = new Date();
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
    };
  };

  const { day, month } = getToday();

  return (
    <div className="journal-page">
      <h1 className="journal-heading">Want to reflect more?</h1>
      <div className="text-block">
        <p className="subtext-modal">Say how you feel in words.</p>
      </div>

      {/* Entry input area */}
      <div className="entry-container">
        {/* Shows today's date */}
        <div className="date-box">
          <div className="day">{day}</div>
          <div className="month">{month}</div>
        </div>

        {/* Journal card */}
        <div className="entry-card">
          {/* Selected mood preview */}
          <div className="mood-line">
            <span className="emoji">{mood?.emoji}</span>
            <span className="label">Feeling: {mood?.label}</span>
          </div>

          {/* Text input for the journal note */}
          <textarea
            className="entry-input"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="How did your day go..."
            rows={1}
            onInput={(e) => {
              // Auto-resize textarea as user types
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />

          {/* Buttons */}
          <div className="entry-footer">
            {/* Submit entry */}
            <button
              onClick={handleSubmit}
              className="submit-button"
              aria-label="Submit Entry"
              disabled={submitting}
            >
              <Check />
            </button>

            {/* Clear text area */}
            <button
              onClick={() => setEntry("")}
              className="delete-icon"
              aria-label="Clear Entry"
              disabled={submitting}
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>

      {/* Popup message after successful entry */}
      {showPopup ? (
        <div className="popup">
          Thanks for sharing. Keep taking care of yourself.
        </div>
      ) : (
        <div className="text-block">
          <p className="footer-modal">
            We listen gently once you have finished
          </p>
        </div>
      )}

      {showPopup && (
        <>
          <KindnessMessage onDismiss={() => setTimeout(() => {
            setShowLoginPrompt(true);
          }, 1500)} />
          {showLoginPrompt && <LoginPrompt />}
        </>
      )}


    </div>
  );
}

// src/components/NewEntryForm.jsx
import { useState } from "react";
import { Check, Trash } from "lucide-react";
import { useEntrySubmit } from "../hooks/useEntrySubmit";
import { useFormattedDate } from "../hooks/useFormattedDate";
import KindnessMessage from "./KindnessMessage";
import LoginPrompt from "./LoginPrompt";
import "./NewEntryForm.css";

export default function NewEntryForm({ mood, onSubmit }) {
  const [entry, setEntry] = useState("");
  const [showKindness, setShowKindness] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [kindnessMessage, setKindnessMessage] = useState(null);

  const { day, month } = useFormattedDate();

  const { submitting, handleSubmit, isLoggedIn } = useEntrySubmit(
    entry,
    setEntry,
    mood,
    onSubmit,
    setKindnessMessage,
    setShowKindness,
    setShowLoginPrompt
  );

  return (
    <div className="new-entry-page">
      <h1 className="new-entry-heading">Want to reflect more?</h1>

      <div className="new-entry-text">
        <p className="new-entry-subtext">Say how you feel in words.</p>
      </div>

      <div className="new-entry-container">
        <div className="new-entry-date">
          <div className="new-entry-day">{day}</div>
          <div className="new-entry-month">{month}</div>
        </div>

        <div className="new-entry-card">
          {mood && (
            <div className="new-entry-mood">
              <span className="new-entry-emoji">
                <img src={mood.icon} alt={mood.name} />
              </span>
            </div>
          )}

          <textarea
            className="new-entry-input"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="What’s on your mind today?"
            rows={1}
          />

          <div className="new-entry-footer">
            <button
              onClick={handleSubmit}
              className="new-entry-submit"
              aria-label="Submit Entry"
              disabled={submitting || (!entry.trim() && !mood)}
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

      {/* Guest messages */}
      {!isLoggedIn && showKindness && <KindnessMessage />}
      {!isLoggedIn && showLoginPrompt && (
        <LoginPrompt
          onComplete={() => {
            onSubmit?.();
          }}
        />
      )}

      {/* Logged-in messages */}
      {isLoggedIn && kindnessMessage && (
        <KindnessMessage message={kindnessMessage} />
      )}

      {/* Default footer */}
      {!showKindness && !showLoginPrompt && !kindnessMessage && (
        <p className="new-entry-footer-text">
          We listen gently once you have finished
        </p>
      )}
    </div>
  );
}

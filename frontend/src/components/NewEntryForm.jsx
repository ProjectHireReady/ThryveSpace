// src/components/NewEntryForm.jsx
import { useState } from "react";
import { Check, Trash } from "lucide-react";
import useEntrySubmit from "../hooks/useEntrySubmit";
import useFormattedDate from "../hooks/useFormattedDate";
import { useAuth } from "../context/AuthContext";
import { useEntries } from "../context/EntriesContext";
import KindnessMessage from "./KindnessMessage";
import LoginPrompt from "./LoginPrompt";
import "./NewEntryForm.css";

export default function NewEntryForm({ mood, onSubmit }) {
  const { day, month } = useFormattedDate();
  const { isAuthenticated: isLoggedIn } = useAuth();
  const { addEntry, entries } = useEntries();

  const {
    entry,
    setEntry,
    title,
    setTitle,
    submitting,
    handleSubmit,
    showKindness,
    showLoginPrompt,
    kindnessMessage,
    onLoginComplete,
  } = useEntrySubmit({
    mood,
    onSubmit,
    isLoggedIn,
    addEntry,
    entries,
  });

  const [imageLoaded, setImageLoaded] = useState(false);

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
              {!imageLoaded && <div className="loading-spinner">Loading...</div>}
              <span
                className="new-entry-emoji"
                style={{ display: imageLoaded ? "inline-block" : "none" }}
              >
                <img
                  src={mood.imageUrl || mood.icon || "/fallback-emoji.png"}
                  alt={mood.name}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              </span>
            </div>
          )}

          {/* Title input */}
          <input
            type="text"
            className="new-entry-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your reflection a title..."
          />

          {/* Note input */}
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
              onClick={() => {
                setEntry("");
                setTitle("");
              }}
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
      {!isLoggedIn && showKindness && (
        <KindnessMessage message={kindnessMessage} onDismiss={onSubmit} />
      )}
      {!isLoggedIn && showLoginPrompt && (
        <LoginPrompt onComplete={onSubmit} />
      )}

      {/* Logged-in messages */}
      {isLoggedIn && kindnessMessage && (
        <KindnessMessage message={kindnessMessage} onDismiss={onSubmit}/>
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, Trash } from "lucide-react";
import { useEntries } from "../context/EntriesContext";
import { formatGuestPayload } from "../utils/guestUtils";
import {
  shouldShowKindness,
  markKindnessShown,
  shouldShowLoginPrompt,
  markLoginPromptShown,
} from "../utils/localStorageUtils";
import KindnessMessage from "./KindnessMessage";
import LoginPrompt from "./LoginPrompt";
import "./NewEntryForm.css";

export default function NewEntryForm({ mood, onSubmit }) {
  const { addEntry } = useEntries();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showKindness, setShowKindness] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getToday = () => {
    const date = new Date();
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
    };
  };
  const { day, month } = getToday();

  const handleSubmit = async () => {
    // Require at least note or mood
    if (!entry.trim() && !mood) {
      return alert("Please pick a mood or write something!");
    }

    const payload = isLoggedIn
      ? { title: title || null, note: entry, mood_id: mood?.id || null }
      : formatGuestPayload(entry, mood, title);

    try {
      setSubmitting(true);
      await addEntry(payload);
      setTitle("");
      setEntry("");

      if (shouldShowKindness()) {
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
      } else if (shouldShowLoginPrompt()) {
        setShowLoginPrompt(true);
        markLoginPromptShown();
      } else {
        onSubmit?.();
        navigate("/entries");
      }
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
      <p className="new-entry-subtext">Say how you feel in words.</p>

      <div className="new-entry-container">
        <div className="new-entry-date">
          <div className="new-entry-day">{day}</div>
          <div className="new-entry-month">{month}</div>
        </div>

        <div className="new-entry-card">
          {/* Mood preview */}
          {mood && (
            <div className="new-entry-mood">
              {!imageLoaded && <div className="loading-spinner">Loading...</div>}
              <span
                className="new-entry-emoji"
                style={{ display: imageLoaded ? "inline-block" : "none" }}
              >
                <img
                  src={mood.imageUrl || "/fallback-emoji.png"}
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
            className="new-entry-title-input"
            value={title}
            maxLength={20}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a short title (max 20 chars)"
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
              disabled={submitting}
            >
              <Check size={20} />
            </button>

            <button
              onClick={() => {
                setTitle("");
                setEntry("");
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

      {showKindness && <KindnessMessage />}
      {showLoginPrompt && (
        <LoginPrompt
          onComplete={() => {
            onSubmit?.();
            navigate("/entries");
          }}
        />
      )}

      {!showLoginPrompt && !showKindness && (
        <p className="new-entry-footer-text">
          We listen gently once you have finished
        </p>
      )}
    </div>
  );
}

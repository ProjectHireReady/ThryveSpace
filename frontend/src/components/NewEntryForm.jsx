import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, Trash } from "lucide-react";
import { useEntries } from "../context/EntriesContext";
import { formatGuestPayload } from "../utils/guestUtils";
import KindnessMessage from "./KindnessMessage";
import LoginPrompt from "./LoginPrompt";
import "./NewEntryForm.css";

// This component shows the journaling form for guests
export default function NewEntryForm({ mood, onSubmit }) {
  const { addEntry } = useEntries();
  const { isLoggedIn } = useAuth();

  const [entry, setEntry] = useState("");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [showKindness, setShowKindness] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Get today's date
  const getToday = () => {
    const date = new Date();
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
    };
  };

  const { day, month } = getToday();

  const handleSubmit = async () => {
  if (!entry.trim()) return alert("Please write something!");

  const payload = isLoggedIn
    ? { note: entry, mood_id: mood?.id || null } // Backend structure
    : formatGuestPayload(entry, mood); // Guest fallback

  try {
    setSubmitting(true);
    await addEntry(payload);

    setEntry("");

    // Step 1: Show Kindness message
    setShowKindness(true);

    // Step 2: After 3 seconds, hide Kindness and show Login Prompt
    setTimeout(() => {
      setShowKindness(false);
      setShowLoginPrompt(true);
    }, 3000); // 3 seconds delay
  } catch (err) {
    console.error("Error saving entry:", err);
    alert("Could not save your note. Please try again.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="journal-page">
      <h1 className="journal-heading">Want to reflect more?</h1>
      <div className="text-block">
        <p className="subtext-modal">Say how you feel in words.</p>
      </div>

      <div className="entry-container">
        {/* Date box */}
        <div className="date-box">
          <div className="day">{day}</div>
          <div className="month">{month}</div>
        </div>

        <div className="entry-card">
          {/* Mood preview (if selected) */}
          <div className="mood-line">
            <span className="emoji">{mood?.emoji}</span>
            <span className="label">Feeling: {mood?.name}</span>
          </div>

          {/* Entry textarea */}
          <textarea
            className="entry-input"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="What’s on your mind today?"
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            disabled={submitting}
          />

          <div className="entry-footer">
            <button
              onClick={handleSubmit}
              className="submit-button"
              aria-label="Submit Entry"
              disabled={submitting}
            >
              <Check />
            </button>

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

      {/* Kindness message */}
      {showKindness && <KindnessMessage />}

      {/* Login prompt */}
      {showLoginPrompt && (
        <LoginPrompt
        onComplete={() => {
          onSubmit?.();
          navigate("/entries"); // instead of window.location.href
        }}/>
        )}

      {/* Default footer when nothing else is shown */}
      {!showKindness && !showLoginPrompt && (
        <div className="text-block">
          <p className="footer-modal">We listen gently once you have finished</p>
        </div>
        )}


    </div>
  );
}
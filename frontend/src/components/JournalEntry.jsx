import { useState } from "react";
import { Check, Trash } from "lucide-react";
import "./JournalEntry.css";
import axios from "axios";

export default function JournalEntry({ mood, onSubmit }) {
  const [entry, setEntry] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  async function handleSubmit() {
    if (!entry.trim()) return alert("Please write something!");

    const payload = {
      mood_name: mood?.label || null,
      note: entry,
    };

    try {
      await axios.post("http://localhost:8000/api/v1/notes/", payload);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setEntry("");
        onSubmit(); // close modal or refresh
      }, 2000);
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Could not save your note. Please try again.");
    }
  }

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
      {/* Heading and Subtext */}
      <h1 className="journal-heading">Want to reflect more?</h1>
      <div className="text-block">
        <p className="subtext-modal">Say how you feel in words.</p>
      </div>

      {/* Entry Section */}
      <div className="entry-container">
        <div className="date-box">
          <div className="day">{day}</div>
          <div className="month">{month}</div>
        </div>

        <div className="entry-card">
          <div className="mood-line">
            <span className="emoji">{mood?.emoji}</span>
            <span className="label">Feeling: {mood?.label}</span>
          </div>
          <textarea
            className="entry-input"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="How did your day go..."
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          <div className="entry-footer">
            <button
              onClick={handleSubmit}
              className="submit-button"
              aria-label="Submit Entry"
            >
              <Check />
            </button>
            <button
              onClick={() => setEntry("")}
              className="delete-icon"
              aria-label="Clear Entry"
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>

      {/* Popup and Footer Note */}
      {showPopup ? (
        <div className="popup">
          Thanks for sharing. Keep taking care of yourself.
        </div>
      ) : (
        <div className="text-block">
          <p className="footer-modal">We listen gently once you have finished</p>
        </div>
      )}
    </div>
  );
}

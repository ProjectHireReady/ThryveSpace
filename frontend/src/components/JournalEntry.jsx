import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Trash } from 'lucide-react';
import './JournalEntry.css';

export default function JournalEntry({ mood, onSubmit }) {
  const [entry, setEntry] = useState('');
  const [showPopup, setShowPopup] = useState(false);

 async function handleSubmit() {
  if (!entry.trim()) return alert('Please write something!');

  const note = {
    mood: mood?.label,
    emoji: mood?.emoji,
    text: entry,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch('http://localhost:3000/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });

    if (!res.ok) throw new Error('Failed to send journal note');

    console.log('✅ Note saved:', await res.json());

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setEntry('');
      onSubmit(); // e.g., close modal
    }, 2000);
  } catch (err) {
    console.error('❌ Error saving note:', err);
    alert('Could not save your note. Please try again.');
  }
}


  const getToday = () => {
    const date = new Date();
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
    };
  };

  const { day, month } = getToday();

  return (
    <div className="journal-page">
      <h1 className="heading">Want to reflect more?</h1>
      <p className="subtext">Write about your feelings more.</p>

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
            placeholder="Text..."
            rows={1}
            style={{
              resize: 'none',
              overflow: 'hidden',
              height: entry ? 'auto' : '1.5rem',
              maxHeight: '150px',
              padding: '10px',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          <div className="entry-footer">
            <button onClick={handleSubmit} className="submit-button" aria-label="Submit Entry">
              <Check />
            </button>
            <button
              onClick={() => setEntry('')} className="delete-icon" aria-label="Clear Entry">
                <Trash />
              </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          Thanks for sharing. Keep taking care of yourself.
        </div>
      )}

      {!showPopup && <p className="footer-note">We listen gently once you have finished</p>}
    </div>
  );
}

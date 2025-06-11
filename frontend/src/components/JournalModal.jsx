import React, { useState } from 'react';
import { Trash, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JournalEntry = ({ mood, onClose }) => {
  const navigate = useNavigate();
  const [entry, setEntry] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
    if (!entry.trim()) return;

    const newEntry = {
      text: entry,
      mood,
      timestamp: new Date().toISOString(),
    };

    const prevEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const updatedEntries = [newEntry, ...prevEntries];
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

    setEntry('');
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
      navigate('/entries'); // go to My Entries
    }, 2000);
  };

  const handleDelete = () => {
    setEntry('');
  };

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
      <button className="close-button" onClick={onClose}>✕</button>

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
            <span className="label">Feeling:  {mood?.label}</span>
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
            <button onClick={handleSubmit} className="submit-button"><Check /></button>
            <button onClick={handleDelete} className="delete-icon"><Trash /></button>
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
};

export default JournalEntry;

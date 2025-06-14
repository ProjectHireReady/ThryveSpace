import React, { useEffect, useState } from 'react';
import { Trash, Pencil } from 'lucide-react';
import './EntriesPage.css'; 

const EntriesPage = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setEntries(stored);
  }, []);

  const handleDelete = (index) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
    localStorage.setItem('journalEntries', JSON.stringify(updated));
  };

  return (
    <div className="entries-page">
      <h1 className="page-title">My Entries</h1>
      <p className="subtext">Recent Entries</p>

      <div className="entries-list">
        {entries.length === 0 && <p>No entries yet.</p>}
        {entries.map((entry, index) => {
          const date = new Date(entry.timestamp);
          const day = date.getDate().toString().padStart(2, '0');
          const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();

          return (
            <div className="entry-card" key={index}>
              <div className="date-box">
                <div className="day">{day}</div>
                <div className="month">{month}</div>
              </div>

              <div className="entry-content">
                <p className="mood-label">
                  <span className="emoji">{entry.mood?.emoji}</span> Feeling :&nbsp;
                  <span className="mood-text">{entry.mood?.label}</span>
                </p>
                <p className="entry-text">{entry.text}</p>

                <div className="entry-actions">
                  <button className="icon-btn"><Pencil size={16} /></button>
                  <button className="icon-btn" onClick={() => handleDelete(index)}><Trash size={16} /></button>
                </div>
              </div>
              <span className="divider"></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EntriesPage;

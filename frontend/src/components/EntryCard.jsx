import './EntryCard.css';
import { PencilLine, Trash2 } from 'lucide-react';
export default function EntryCard({ entry }) {
  const date = new Date(entry.created_at);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  return (
    <div className="entry-container">
      {/* Left Date Box */}
      <div className="date-box">
        <div className="day">{day}</div>
        <div className="month">{month}</div>
      </div>

      {/* Right Entry Card */}
      <div className="entry-card">
        <div className="mood-line">
          <span className="emoji">{entry.mood?.emoji || '📝'}</span>
          <span className="label">Feeling:</span>
          <span>{entry.mood?.label || 'No mood'}</span>
        </div>

        <p className="note">{entry.note}</p>

        {/* Footer with Edit and Delete */}
        <div className="entry-footer">
          <button className="icon-button edit-icon" title="Edit Entry">
            <PencilLine size={18} strokeWidth={2} />
          </button>
          <button className="icon-button delete-icon" title="Delete Entry">
            <Trash2 size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

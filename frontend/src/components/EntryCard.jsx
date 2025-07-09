// Import styles and icons
import "./EntryCard.css";
import {
  PencilLine,
  Trash2,
  MessageSquare,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useEntries } from "../context/EntriesContext"; // Custom context for editing/deleting entries

export default function EntryCard({ entry }) {
  // Local state
  const [isExpanded, setIsExpanded] = useState(false); // Whether note is fully shown
  const [isEditing, setIsEditing] = useState(false);   // Whether we’re in edit mode
  const [editNote, setEditNote] = useState(entry.note); // Temp text for editing note
  const noteWrapperRef = useRef(null); // For controlling scroll when collapsing

  const { updateEntry, removeEntry } = useEntries(); // Context functions

  // Format created_at date
  const date = new Date(entry.created_at);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();

  // Auto-scroll to top of note when collapsed again
  useEffect(() => {
    if (!isExpanded && noteWrapperRef.current) {
      noteWrapperRef.current.scrollTop = 0;
    }
  }, [isExpanded]);

  // Save edited note
  const handleSave = async () => {
    if (!editNote.trim()) return; // Prevent saving empty note
    try {
      await updateEntry(entry.id, { note: editNote }); // Update in context
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      alert("Failed to save edit."); // Show error if something fails
    }
  };

  return (
    <div className="entry-container">
      {/* Entry date (left side) */}
      <div className="date-box">
        <div className="day">{day}</div>
        <div className="month">{month}</div>
      </div>

      {/* Main journal card */}
      <div className={`entry-card ${isEditing ? "editing-mode" : ""}`}>
        {/* Mood display row */}
        <div className="mood-line">
          <span className="emoji">
            {entry.mood?.image_url ? (
              <img
                src={entry.mood.image_url}
                alt={entry.mood.name || "Mood"}
                className="mood-img"
              />
            ) : (
              <MessageSquare className="emoji-icon" />
            )}
          </span>
          <span className="label">Feeling:</span>
          <span>{entry.mood?.name || "No mood selected"}</span>
        </div>

        {/* Note display or editing */}
        {isEditing ? (
          // If editing, show textarea
          <textarea
            className="entry-edit-textarea"
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            rows={4}
          />
        ) : (
          // If not editing, show note
          <>
            <div
              ref={noteWrapperRef}
              className={`note-wrapper ${isExpanded ? "expanded" : "collapsed"}`}
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <p className="note">{entry.note}</p>
            </div>
            {/* Show "Read more" if note is long */}
            {!isExpanded && entry.note.length > 100 && (
              <span className="read-more" onClick={() => setIsExpanded(true)}>
                ... Read more <ChevronDown size={16} />
              </span>
            )}
          </>
        )}

        {/* Action buttons (Edit/Delete or Save/Cancel) */}
        <div className="entry-footer">
          {isEditing ? (
            <>
              {/* Save updated note */}
              <button className="icon-button save-icon" title="Save" onClick={handleSave}>
                <Check size={18} />
              </button>

              {/* Cancel editing */}
              <button
                className="icon-button cancel-icon"
                title="Cancel"
                onClick={() => {
                  setEditNote(entry.note); // Reset changes
                  setIsEditing(false);     // Exit editing
                }}
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              {/* Start editing */}
              <button
                className="icon-button edit-icon"
                title="Edit Entry"
                onClick={() => setIsEditing(true)}
              >
                <PencilLine size={18} />
              </button>

              {/* Delete entry with confirmation */}
              <button
                className="icon-button delete-icon"
                title="Delete Entry"
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this entry?"
                  );
                  if (confirmDelete) removeEntry(entry.id);
                }}
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

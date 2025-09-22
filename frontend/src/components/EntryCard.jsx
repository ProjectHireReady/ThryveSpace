import "./EntryCard.css";
import {
  PencilLine,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useEntries } from "../context/EntriesContext";

export default function EntryCard({ entry }) {
  const { removeEntry, updateEntry } = useEntries();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(entry.note);
  const noteWrapperRef = useRef(null);

  const date = entry.created_at ? new Date(entry.created_at) : null;
  const day = date && !isNaN(date.getTime()) ? date.getDate() : "—";
  const month =
    date && !isNaN(date.getTime())
      ? date.toLocaleString("en-US", { month: "short" }).toUpperCase()
      : "—";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isEditing &&
        noteWrapperRef.current &&
        !noteWrapperRef.current.contains(e.target)
      ) {
        handleCancelEdit();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setEditedNote(entry.note);
    setIsEditing(false);
  };
  const handleSaveEdit = () => {
    if (!editedNote.trim()) return;
    updateEntry(entry.id, { note: editedNote });
    setIsEditing(false);
  };
  const handleDelete = () => removeEntry(entry.id);

  return (
    <div
      className={`entry-card-wrapper accordion-item
              ${isExpanded ? "open" : ""}
              ${isEditing ? "editing" : ""}`}
    >
      <div
        className="accordion-header"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="date-box">
          <div className="day">{day}</div>
          <div className="month">{month}</div>
        </div>
        <div className="mood-line">
          <span className="emoji">
            {entry.icon ? (
              <img
                src={entry.icon}
                alt={entry.name || "Mood"}
                className="mood-img"
              />
            ) : null}
          </span>
        </div>
        <div className="expand-icon">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {isExpanded && (
        <div className="accordion-body">
          {isEditing ? (
            <textarea
              value={editedNote}
              onChange={(e) => setEditedNote(e.target.value)}
              className="entry-edit-textarea"
              rows={4}
            />
          ) : (
            <>
              <div
                ref={noteWrapperRef}
                className={`note-wrapper ${
                  isExpanded ? "expanded" : "collapsed"
                }`}
              >
                <p className="note">{entry.note}</p>
              </div>
              {!isExpanded && entry.note.length > 100 && (
                <span className="read-more" onClick={() => setIsExpanded(true)}>
                  ... Read more <ChevronDown size={16} />
                </span>
              )}
            </>
          )}

          <div className="entry-footer">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="icon-button save-icon"
                  title="Save"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="icon-button cancel-icon"
                  title="Cancel"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditClick}
                  className="icon-button edit-icon"
                  title="Edit"
                >
                  <PencilLine size={18} />
                </button>
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this entry?"
                    );
                    if (confirmDelete) handleDelete();
                  }}
                  className="icon-button delete-icon"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

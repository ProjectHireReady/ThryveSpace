import { useState, useMemo } from "react";
import {
  Search,
  PlusCircle,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import EntryCard from "../components/EntryCard";
import JournalModal from "../components/JournalModal";
import NewEntryForm from "../components/NewEntryForm";
import { useEntries } from "../context/EntriesContext";

import "./EntriesPage.css";

function EntriesPage() {
  // Fetch entries and actions from context
  const {
    entries,
    loading,
    error,
    fetchEntries,
    updateEntry,
    removeEntry,
  } = useEntries();

  const [searchTerm, setSearchTerm] = useState("");     // For filtering entries
  const [showModal, setShowModal] = useState(false);    // Journal modal toggle
  const [selectedMood, setSelectedMood] = useState(null); // For mood selection

  // Open modal when "Add Entry" is clicked
  const handleAddEntry = () => setShowModal(true);

  // Close modal after successful entry
  const closeModal = () => setShowModal(false);

  // Filter entries by user search
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) =>
      entry.note?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [entries, searchTerm]);

  // Conditions for displaying UI elements
  // handles if entries is undefined or null
  const hasEntries = Array.isArray(entries) && entries.length > 0;

  const shouldShowSearchAndAdd = hasEntries && !loading && !error;const shouldShowAddOnly = !hasEntries && !loading && !error;


  return (
    <section
      className={`entries-page ${
        !loading && entries.length === 0 ? "no-scroll" : ""
      }`}
    >
      {/* Header */}
      <div className="top-bar">
        <div className="top-bar-row">
          <h1 className="main-header">My Entries</h1>
        </div>

        {/* Search + Add Entry (only if entries exist) */}
        {shouldShowSearchAndAdd && (
          <div className="action-row">
            <div className="search-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search Entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="add-btn" onClick={handleAddEntry}>
              <PlusCircle size={19} /> Add Entry
            </button>
          </div>
        )}

        {/* Only Add button (if no entries or first time) */}
        {shouldShowAddOnly && (
          <div className="action-row">
            <button className="add-btn" onClick={handleAddEntry}>
              <PlusCircle size={19} /> Add Entry
            </button>
          </div>
        )}
      </div>

      {/* Subheading (when entries exist) */}
      {shouldShowSearchAndAdd && <h2 className="subheader">Recent Entries</h2>}

      {/* Main Content States */}
      {loading ? (
        // Loading state
        <div className="centered-message loading-state">
          <LoaderCircle className="loading-icon" size={24} />
          <p>Loading entries...</p>
        </div>
      ) : error ? (
        // Error state
        <div className="centered-message error-state">
          <div className="error-icon-wrapper">
            <AlertCircle className="error-icon" size={36} />
          </div>
          <p className="error-message">{error}</p>
          <div className="btns">
            <button className="retry-btn" onClick={fetchEntries}>
            Retry
            </button>
            <button className="add-btn" onClick={handleAddEntry}>
              <PlusCircle size={19}/> Add Entry
            </button>
          </div>
        </div>
      ) : filteredEntries.length === 0 ? (
        // Empty or no search result
        <p className="centered-message empty-state">
          No entries found. Try adding one! 😊
        </p>
      ) : (
        // Render list of entries
        <div className="entries-list">
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onUpdate={updateEntry}
              onDelete={removeEntry}
            />
          ))}
        </div>
      )}

            {/* Modal Form */}

      <JournalModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedMood(null); // reset mood when modal closes
        }}
      >
        <NewEntryForm
          mood={selectedMood}
          onSubmit={() => {
            closeModal();
            setSelectedMood(null); // reset after submission too
          }}
        />
      </JournalModal>
    </section>
  );
}

export default EntriesPage;

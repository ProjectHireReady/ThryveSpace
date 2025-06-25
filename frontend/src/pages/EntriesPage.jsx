import { useState } from "react";
import {
  ChevronLeft,
  LoaderCircle,
  Search,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import { useEntries } from "../hooks/useEntries";
import EntryCard from "../components/EntryCard";
import JournalModal from "../components/JournalModal";
import JournalEntry from "../components/JournalEntry";
import "./EntriesPage.css";

function EntriesPage() {
  const { entries, loading, error, refresh } = useEntries();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddEntry = () => setShowModal(true);

  const filteredEntries = entries.filter((entry) =>
    entry.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="entries-page">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-row">
          {/* <button className="icon-btn back-icon"> */}
          {/* <ChevronLeft size={20} strokeWidth={2} /> */}
          {/* </button> */}
          <h1 className="main-header">My Entries</h1>
        </div>

        {/* Search & Add button if entries exist */}
        {entries.length > 0 && !loading && !error && (
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

        {/* Only Add button if no entries */}
        {(entries.length === 0 || error) && !loading && (
          <div className="action-row">
            <button className="add-btn" onClick={handleAddEntry}>
              <PlusCircle size={19} /> Add Entry
            </button>
          </div>
        )}
      </div>

      {/* Subheader */}
      {entries.length > 0 && !error && (
        <h2 className="subheader">Recent Entries</h2>
      )}

      {/* Entry List / States */}
      {loading ? (
        <div className="centered-message loading-state">
          <LoaderCircle className="loading-icon" size={24} />
          <p>Loading entries...</p>
        </div>
      ) : error ? (
        <div className="centered-message error-state">
          <div className="error-icon-wrapper">
            <AlertCircle className="error-icon" size={36} />
          </div>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={refresh}>
            Retry
          </button>
        </div>
      ) : filteredEntries.length === 0 ? (
        <p className="centered-message empty-state">
          No entries found. Try adding one! 😊
        </p>
      ) : (
        <div className="entries-list">
          {filteredEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {/* Modal */}
      <JournalModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <JournalEntry
          mood={null}
          onSubmit={() => {
            setShowModal(false);
            refresh();
          }}
        />
      </JournalModal>
    </section>
  );
}

export default EntriesPage;

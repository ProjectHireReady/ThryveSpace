import { useState, useMemo } from "react";
import { PlusCircle, LoaderCircle, AlertCircle, Search, FileDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEntries } from "../context/EntriesContext";
import { downloadGuestEntriesPDF } from "../utils/exportPDF";
import EntryCard from "../components/EntryCard";
import JournalModal from "../components/JournalModal";
import NewEntryForm from "../components/NewEntryForm";
import "./EntriesPage.css";

function EntriesPage() {
  // Auth & entries
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { entries, loading, error, fetchEntries, updateEntry, removeEntry } = useEntries();

  // Local state
  const [searchTerm, setSearchTerm] = useState(""); // For filtering entries
  const [showModal, setShowModal] = useState(false); // Journal modal toggle
  const [selectedMood, setSelectedMood] = useState(null); // For mood selection

  // Open modal
  const handleAddEntry = () => setShowModal(true);

  // Export PDF for guest entries
  const handleDownloadPDF = () => {
    if (entries.length === 0) return alert("No entries to export.");
    downloadGuestEntriesPDF(entries);
  };

  // Close modal
  const closeModal = () => setShowModal(false);

  // Filter entries by search term
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) =>
      entry.note?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [entries, searchTerm]);

  // Conditions for displaying UI elements
  const hasEntries = Array.isArray(entries) && entries.length > 0;
  const shouldShowSearchAndAdd = hasEntries && !loading && !error;
  const shouldShowAddOnly = !hasEntries && !loading && !error;

  return (
    <section className={`entries-page ${!loading && entries.length === 0 ? "no-scroll" : ""}`}>
      {/* Header */}
      <div className="top-bar">
        <div className="top-bar-row">
          <h1 className="main-header">My Entries</h1>
        </div>

        {/* Search + Add Entry + Export */}
        {shouldShowSearchAndAdd && (
          <div className="action-row">
            <div className="search-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search Entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button className="add-btn" onClick={handleAddEntry}>
                <PlusCircle size={19} /> Add Entry
              </button>
              {!isLoggedIn && entries.length > 0 && (
                <button className="export-btn" onClick={handleDownloadPDF}>
                  <FileDown size={18} /> Export PDF
                </button>
              )}
            </div>
          </div>
        )}

        {/* Only Add button */}
        {shouldShowAddOnly && (
          <div className="action-row">
            <button className="add-btn" onClick={handleAddEntry}>
              <PlusCircle size={19} /> Add Entry
            </button>
          </div>
        )}
      </div>

      {/* Subheading */}
      {shouldShowSearchAndAdd && <h2 className="subheader">Recent Entries</h2>}

      {/* Main Content */}
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
          <div className="btns">
            <button className="retry-btn" onClick={fetchEntries}>
              Retry
            </button>
            <button className="add-btn" onClick={handleAddEntry}>
              <PlusCircle size={19} /> Add Entry
            </button>
          </div>
        </div>
      ) : filteredEntries.length === 0 ? (
        <p className="centered-message empty-state">
          No entries found. Try adding one! 😊
        </p>
      ) : (
        <div className="entries-grid">
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
          setSelectedMood(null);
        }}
      >
        <NewEntryForm
          mood={selectedMood}
          onSubmit={() => {
            closeModal();
            setSelectedMood(null);
          }}
        />
      </JournalModal>
    </section>
  );
}

export default EntriesPage;


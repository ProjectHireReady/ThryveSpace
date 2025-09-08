import { useState, useMemo, useEffect } from "react";
import {
  PlusCircle,
  LoaderCircle,
  AlertCircle,
  Search,
  FileDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEntries } from "../context/EntriesContext";
import { downloadGuestEntriesPDF } from "../utils/exportPDF";
import EntryCard from "../components/EntryCard";
import JournalModal from "../components/JournalModal";
import NewEntryForm from "../components/NewEntryForm";
import InsightBanner from "../components/InsightBanner";
import { getInsights } from "../api/insights";
import "./EntriesPage.css";

function EntriesPage() {
  // Context
  const { entries, loading, error, fetchEntries, updateEntry, removeEntry } =
    useEntries();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [insight, setInsight] = useState(null);

  // Auth
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Fetch insights
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await getInsights();
        setInsight(res.data); // expects { type, message }
      } catch (err) {
        console.error("Failed to fetch insights:", err);
      }
    };
    fetchInsights();
  }, []);

  // Handlers
  const handleAddEntry = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  const handleDownloadPDF = () => {
    if (entries.length === 0) return alert("No entries to export.");
    downloadGuestEntriesPDF(entries);
  };

  // Derived values
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) =>
      entry.note?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [entries, searchTerm]);

  const hasEntries = Array.isArray(entries) && entries.length > 0;
  const shouldShowSearchAndAdd = hasEntries && !loading && !error;
  const shouldShowAddOnly = !hasEntries && !loading && !error;

  return (
    <section
      className={`entries-page ${!loading && entries.length === 0 ? "no-scroll" : ""
        }`}
    >
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

        {/* Add button only */}
        {shouldShowAddOnly && (
          <div className="action-row">
            <button className="add-btn" onClick={handleAddEntry}>
              <PlusCircle size={19} /> Add Entry
            </button>
          </div>
        )}
      </div>

      {/* 🟢 Insights Banner */}
      {insight && (
        <InsightBanner type={insight.type} message={insight.message} />
      )}

      {/* Subheading */}
      {shouldShowSearchAndAdd && <h2 className="subheader">Recent Entries</h2>}

      {/* Content */}
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

      {/* Modal */}
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

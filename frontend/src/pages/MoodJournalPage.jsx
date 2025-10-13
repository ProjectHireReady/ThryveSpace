// MoodJournalPage.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MoodSelector from "../components/MoodSelector";
import JournalModal from "../components/JournalModal";
import NewEntryForm from "../components/NewEntryForm";

// Handles journaling flow: select mood → write note → go to entries
export default function MoodJournalPage() {
  const [selectedMood, setSelectedMood] = useState(null); // Stores mood object
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const navigate = useNavigate();

  // When a mood is selected from MoodSelector
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setIsModalOpen(true);
  };

  // Called when modal closes or entry is submitted
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMood(null);
    navigate("/entries");
  };

  return (
    <>
      {/* Lock scroll only in this wrapper */}
      <div className="mood-fullscreen-container">
        <MoodSelector onMoodSelect={handleMoodSelect} />
      </div>

      {/* Journal modal after mood is chosen */}
      <JournalModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NewEntryForm
          mood={selectedMood}
          onSubmit={handleCloseModal}
        />

      </JournalModal>
    </>
  );
}

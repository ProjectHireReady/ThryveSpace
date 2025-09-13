import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MoodSelector from "../components/MoodSelector";
import JournalModal from "../components/JournalModal";
import NewEntryForm from "../components/NewEntryForm";

// This page handles the journaling flow: selecting a mood, writing a note, and navigating to entries
export default function MoodJournalPage() {
  const [selectedMood, setSelectedMood] = useState(null); // Stores the selected mood object
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const navigate = useNavigate(); // Used to redirect user after submitting

  // When a mood is selected from MoodSelector
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood); // Store the full mood object
    setIsModalOpen(true); // Open modal
  };

  // Called after journal entry is submitted or modal is closed
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMood(null);
    navigate("/entries");
  };

  return (
    <>
      <div className="mood-fullscreen-container">
        <MoodSelector onMoodSelect={handleMoodSelect} />
      </div>

      <JournalModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NewEntryForm
          mood={selectedMood}
          onSubmit={() => {
            setIsModalOpen(false);
            setSelectedMood(null);
          }}
        />
      </JournalModal>
    </>
  );
}

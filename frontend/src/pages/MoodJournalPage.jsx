import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MoodSelector from "../components/MoodSelector";
import JournalModal from "../components/JournalModal";
import NewEntryForm from "../components/NewEntryForm";

// This page handles the journaling flow: selecting a mood, writing a note, and navigating to entries
export default function MoodJournalPage() {
  const [selectedMood, setSelectedMood] = useState(null); // Stores the selected mood
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const navigate = useNavigate(); // Used to redirect user after submitting

  // When a mood is selected from the MoodSelector
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood); // Store the selected mood
    setIsModalOpen(true); // Show the journal modal
  };

  // Called after journal entry is submitted or modal is closed
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedMood(null); // Reset selected mood
    navigate("/entries"); // Redirect user to the entries page
  };

  return (
    <>
      {/* Lock scroll only in this wrapper */}
      <div className="mood-fullscreen-container">
        <MoodSelector onMoodSelect={handleMoodSelect} />
      </div>

      {/* Journal modal that appears after mood is chosen */}
      <JournalModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <NewEntryForm mood={selectedMood} onSubmit={() => {
          setIsModalOpen(false); // Just close modal, NO redirect yet
          setSelectedMood(null);
          }} />
      </JournalModal>
    </>
  );
}

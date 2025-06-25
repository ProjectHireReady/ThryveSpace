import { useState } from "react";
import MoodSelector from "../components/MoodSelector";
import JournalModal from "../components/JournalModal";
import JournalEntry from "../components/JournalEntry";

export default function MoodJournalPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMood(null);
  };

  return (
    <>
      {/* Lock scroll only in this wrapper */}
      <div className="mood-fullscreen-container">
        <MoodSelector onMoodSelect={handleMoodSelect} />
      </div>

      {/* Let the modal live outside, above all */}
      <JournalModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <JournalEntry mood={selectedMood} onSubmit={handleCloseModal} />
      </JournalModal>
    </>
  );
}

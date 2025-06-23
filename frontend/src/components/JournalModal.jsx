import { useEffect } from "react";
import { X } from "lucide-react"; // Lucide close icon
import "./JournalModal.css";

export default function JournalModal({ isOpen, onClose, children }) {
  useEffect(() => {
    // Function to close modal when Escape key is pressed
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    // Add keydown listener only if modal is open
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Remove listener when component unmounts or modal closes
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // If modal is closed, don’t render anything
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose} // Close modal if user clicks outside the content
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside the modal
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} stroke="black" />
        </button>

        {/* Render modal content */}
        {children}
      </div>
    </div>
  );
}

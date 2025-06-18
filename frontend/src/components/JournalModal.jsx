import React, { useEffect } from 'react';
import './JournalModal.css';

export default function JournalModal({ isOpen, onClose, children }) {
  // useEffect runs whenever `isOpen` or `onClose` changes
  useEffect(() => {
    // Handler for keyboard events
    function onKeyDown(e) {
      // If Escape key is pressed, call onClose to close the modal
      if (e.key === 'Escape') onClose();
    }

    // If the modal is open, add event listener for keydown
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
    }

    // Cleanup function: removes the event listener when modal closes or component unmounts
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]); // dependencies: re-run effect if these change

  // If modal is not open, do not render anything
  if (!isOpen) return null;

  // Render modal overlay and modal content
  return (
    // Overlay covers entire screen, clicking it triggers onClose to close modal
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"        // Accessibility: indicates this is a dialog/modal
      aria-modal="true"    // Accessibility: indicates rest of page is inert when modal open
    >
      {/* 
        Modal content box
        Stops click propagation so clicking inside modal doesn't close it 
      */}
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal content is rendered here */}
        {children}
      </div>
    </div>
  );
}

import { useState } from "react";

function MigrationPrompt({ onConfirm, onDecline }) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="migration-prompt">
      <p>We found guest entries. Do you want to migrate them to your account?</p>
      <button onClick={() => { onConfirm(); setOpen(false); }}>Yes</button>
      <button onClick={() => { onDecline(); setOpen(false); }}>No</button>
    </div>
  );
}

export default MigrationPrompt;

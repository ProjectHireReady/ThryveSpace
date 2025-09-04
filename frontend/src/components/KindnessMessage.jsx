import { X } from "lucide-react";
import "./KindnessMessage.css";

export default function KindnessMessage({ onDismiss }) {
  return (
    <div className="fade kindness-popup">
      <p>You’re doing great ❤️</p>
      <button
        onClick={onDismiss}
        className="kindness-dismiss"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
}

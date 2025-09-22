import { X } from "lucide-react";
import "./KindnessMessage.css";

export default function KindnessMessage({
  message = "You’re doing great ❤️",
  onDismiss,
}) {
  return (
    <div className="fade kindness-popup">
      <p>{message}</p>
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

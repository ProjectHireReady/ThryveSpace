import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./KindnessMessage.css";

export default function KindnessMessage({
  message = "You’re doing great ❤️",
  onDismiss,
}) {
  const navigate = useNavigate();

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(); // let parent handle closing modal
    } else {
      navigate("/entries"); // fallback if no handler
    }
  };

  return (
    <div className="fade kindness-popup">
      <p>{message}</p>
      <button
        onClick={handleDismiss}
        className="kindness-dismiss"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
}

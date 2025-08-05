import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  shouldShowKindness,
  markKindnessShown,
} from "../utils/localStorageUtils";
import "./KindnessMessage.css";

export default function KindnessMessage({ onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (shouldShowKindness()) {
      setVisible(true);
      markKindnessShown(); //mark immediately, not only on dismiss
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    markKindnessShown();
    onDismiss?.(); // optional callback
  };

  if (!visible) return null;

  return (
    <div className="fade kindness-popup">
      <p>You’re doing great ❤️</p>
      <button onClick={handleDismiss} className="kindness-dismiss" aria-label="Close">
        <X size={16} />
      </button>
    </div>
  );
}

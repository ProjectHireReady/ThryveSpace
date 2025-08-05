import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { shouldShowLoginPrompt, markLoginPromptShown } from "../utils/localStorageUtils"; // ✅ Move logic here
import "./KindnessMessage.css";

export default function LoginPrompt({ onComplete }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ✅ Only show if allowed by localStorage
    if (shouldShowLoginPrompt()) {
      const timer = setTimeout(() => {
        setVisible(true);
        markLoginPromptShown(); // ✅ Mark it once shown
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    onComplete?.(); // notify parent
  };

  const handleSignIn = () => {
    window.location.href = "/signin";
  };

  if (!visible) return null;

  return (
    <div className="fade kindness-popup">
      <p>Want to keep this forever? Log in to save your story.</p>
      <div className="btn-row">
        <button onClick={handleSignIn} className="login-btn">Sign in now</button>
        <button onClick={handleDismiss} className="kindness-dismiss" aria-label="Not now">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

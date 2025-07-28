import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  shouldShowLoginPrompt,
  markLoginPromptShown,
} from "../utils/localStorageUtils";
import "./KindnessMessage.css";

export default function LoginPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (shouldShowLoginPrompt()) {
      setTimeout(() => setVisible(true), 1500); // 1.5s delay after kindness
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    markLoginPromptShown();
  };

  const handleSignIn = () => {
    // e.g. redirect to /sign in
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

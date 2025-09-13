import { X } from "lucide-react";
import "./KindnessMessage.css";

export default function LoginPrompt({ onComplete }) {
  const handleDismiss = () => {
    onComplete?.(); // tell parent it’s done
  };

  const handleSignIn = () => {
    window.location.href = "/signin";
  };

  return (
    <div className="fade kindness-popup">
      <p>Want to keep this forever? Log in to save your story.</p>
      <div className="btn-row">
        <button onClick={handleSignIn} className="login-btn">
          Sign in now
        </button>
        <button
          onClick={handleDismiss}
          className="kindness-dismiss"
          aria-label="Not now"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

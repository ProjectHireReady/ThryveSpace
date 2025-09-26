import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./KindnessMessage.css";

export default function LoginPrompt({ onComplete }) {
  const navigate = useNavigate();

  const handleDismiss = () => {
    // User skips login and go to entries
    onComplete?.();
    navigate("/entries");
  };

  const handleSignIn = () => {
    // Use navigate instead of full reload
    navigate("/login");
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

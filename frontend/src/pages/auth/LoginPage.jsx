import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import authLogo from "../../assets/auth/auth2.svg";
import "./Auth.css";

// Pull in entries context to refresh entries after login
import { useEntries } from "../../context/EntriesContext";

// email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login, loading: authLoading, error: authError } = useAuth();
  const entriesCtx = (() => {
    try {
      return useEntries();
    } catch {
      // If EntriesContext isn't wired yet, avoid crashing.
      return null;
    }
  })();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  // Track the brief post-login sync to disable the button & avoid double submits
  const [syncing, setSyncing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Email and password are required");
      return;
    }
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email");
      return;
    }

    try {
      setSyncing(true);
      // 1) Authenticate
      await login({ email, password });

      // 2) Immediately refresh entries from backend for instant UI consistency
      // Assumes EntriesContext exposes refreshEntries({ force?: boolean })
      if (entriesCtx?.refreshEntries) {
        await entriesCtx.refreshEntries({ force: true });
      } else {
        // Optional: soft fallback so nothing breaks if context not ready
        // window.dispatchEvent(new CustomEvent("entries:refresh")); // if you have a global handler
      }
    } catch (err) {
      setLocalError(err?.message || authError || "Login failed");
    } finally {
      setSyncing(false);
    }
  };

  const isBusy = authLoading || syncing;

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image-wrapper">
          <img src={authLogo} alt="Login Illustration" className="auth-image" />
        </div>

        <div className="auth-form-wrapper">
          <form className="auth-form login-form" onSubmit={handleSubmit} noValidate>
            <h2>Welcome Back!</h2>

            {(localError || authError) && (
              <p className="error-msg" role="alert">
                {localError || authError}
              </p>
            )}

            <p className="auth-subtext">
              Log in to continue your journey with{" "}
              <span className="brand-blue">ThryveSpace</span>.
            </p>

            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              aria-invalid={!!localError && !emailRegex.test(email)}
            />

            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            <button type="submit" disabled={isBusy} aria-busy={isBusy}>
              {isBusy ? "Processing..." : "Login"}
            </button>

            <p className="toggle-text">
              New to ThryveSpace? <Link to="/signup">Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

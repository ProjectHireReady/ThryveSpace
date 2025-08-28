import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import authLogo from "../../assets/auth/auth2.svg";
import "./Auth.css";

// email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login, loading: authLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

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
      await login({ email, password });
    } catch (err) {
      setLocalError(err?.message || authError || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image-wrapper">
          <img src={authLogo} alt="Login Illustration" className="auth-image" />
        </div>

        <div className="auth-form-wrapper">
          <form className="auth-form login-form" onSubmit={handleSubmit}>
            <h2>Welcome Back!</h2>

            {(localError || authError) && (
              <p className="error-msg">{localError || authError}</p>
            )}

            <p className="auth-subtext">
              Log in to continue your journey with{" "}
              <span className="brand-blue">ThryveSpace</span>.
            </p>

            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <button type="submit" disabled={authLoading}>
              {authLoading ? "Processing..." : "Login"}
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

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import signupImage from "../../assets/auth/auth2.svg";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

// email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const { signup, loading: authLoading, error: authError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Basic client-side validations
    if (!firstName || !lastName) {
      setLocalError("First and last name are required");
      return;
    }
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      // Call signup from AuthContext
      await signup({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      navigate("/login"); // Redirect on success
    } catch (err) {
      setLocalError(err?.message || authError || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image-wrapper">
          <img src={signupImage} alt="Signup" className="auth-image" />
        </div>

        <div className="auth-form-wrapper">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            {(localError || authError) && (
              <p className="error-msg">{localError || authError}</p>
            )}

            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g., Elizabeth"
              required
            />

            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g., Williams"
              required
            />

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
              placeholder="At least 8 characters"
              required
            />

            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={authLoading}>
              {authLoading ? "Processing..." : "Sign Up"}
            </button>

            <p className="toggle-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

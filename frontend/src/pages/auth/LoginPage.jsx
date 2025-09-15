// pages/auth/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useEntries } from "../../context/EntriesContext";
import { Link, useNavigate } from "react-router-dom";
import authLogo from "../../assets/auth/auth2.svg";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import "./Auth.css";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login, loading: authLoading, error: authError } = useAuth();
  const { fetchEntries } = useEntries(); // fetch user entries after login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // After login: load entries and navigate to moods page
  const finishLogin = async () => {
    await fetchEntries();
    navigate("/mood");
  };

  // Clear specific field error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: null }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // CRITICAL: Prevent browser validation
    e.target.setAttribute('novalidate', 'true');
    setErrors({});


    const result = loginSchema.safeParse({ email, password });


    if (!result.success) {
      const formatted = {};
      result.error?.issues?.forEach(err => {
        formatted[err.path[0]] = err.message;
      });
      setErrors(formatted);
      return;
    }


    try {
      await login({ email, password });
      await finishLogin(); // normal flow
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        form: err?.message || authError || "Login failed"
      }));

    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Image section */}
        <div className="auth-image-wrapper">
          <img src={authLogo} alt="Login Illustration" className="auth-image" />
        </div>

        {/* Login form */}
        <div className="auth-form-wrapper">
          <form className="auth-form login-form" onSubmit={handleSubmit} noValidate>
            <h2>Welcome Back!</h2>

            {/* Show error messages */}
            {errors.form && (
              <p className="error-msg">{errors.form}</p>)}

            <p className="auth-subtext">
              Log in to continue your journey with{" "}
              <span className="brand-blue">ThryveSpace</span>.
            </p>

            <label>Email:</label>
            <input
              id="login-email"
              type="email"
              value={email}
              // onChange={(e) => setEmail(e.target.value)}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              className={errors.email ? 'error' : ''}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
            {errors.email && (
              <p id="login-email-error" className="inline-error">
                {errors.email}
              </p>
            )}

            <label>Password:</label>
            <div className={`password-input-wrapper ${errors.password ? 'error' : ''}`}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                // onChange={(e) => setPassword(e.target.value)}
                onChange={handlePasswordChange}
                className={errors.password ? 'error' : ''}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                placeholder="Enter your password"

              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p id="login-password-error" className="inline-error">
                {errors.password}
              </p>
            )}


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

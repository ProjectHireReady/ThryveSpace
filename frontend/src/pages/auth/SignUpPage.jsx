import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import signupImage from "../../assets/auth/auth2.svg";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export default function SignupPage() {
  // const { signup, loading: authLoading, error: authError } = useAuth();
  const { signup, authLoading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (name === "password" && errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.setAttribute("novalidate", "true");

    setErrors({});
    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const firstError = result.error.issues[0];
      setErrors({ [firstError.path[0]]: firstError.message });
      document.querySelector(`[name="${firstError.path[0]}"]`)?.focus();
      return;
    }

    try {
      await signup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      setErrors({
        form: err?.message || authError || "Signup failed. Please try again.",
      });
    }
  };

  return (
    <div className="auth-page signup-page">
      <div className="auth-container">
        <div className="auth-image-wrapper">
          <img src={signupImage} alt="Signup" className="auth-image" />
        </div>

        <div className="auth-form-wrapper">
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h2>Sign Up</h2>

            {errors.form && <div className="error-msg">{errors.form}</div>}

            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name e.g., Elizabeth"
              className={errors.firstName ? "error" : ""}
              aria-invalid={errors.firstName ? "true" : undefined}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              autoComplete="given-name"
            />
            {errors.firstName && (
              <p id="firstName-error" className="inline-error">
                {errors.firstName}
              </p>
            )}

            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name e.g., Williams"
              className={errors.lastName ? "error" : ""}
              aria-invalid={errors.lastName ? "true" : undefined}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              autoComplete="family-name"
            />
            {errors.lastName && (
              <p id="lastName-error" className="inline-error">
                {errors.lastName}
              </p>
            )}

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email e.g., you@example.com"
              className={errors.email ? "error" : ""}
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="username"
            />
            {errors.email && (
              <p id="email-error" className="inline-error">
                {errors.email}
              </p>
            )}

            <div className={`password-input-wrapper ${errors.password ? "error" : ""}`}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (at least 8 characters)"
                className={errors.password ? "error" : ""}
                aria-invalid={errors.password ? "true" : undefined}
                aria-describedby={errors.password ? "password-error" : undefined}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="inline-error">
                {errors.password}
              </p>
            )}

            <div className={`password-input-wrapper ${errors.confirmPassword ? "error" : ""}`}>
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={errors.confirmPassword ? "error" : ""}
                aria-invalid={errors.confirmPassword ? "true" : undefined}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="inline-error">
                {errors.confirmPassword}
              </p>
            )}

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

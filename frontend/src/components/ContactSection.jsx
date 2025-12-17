// src/components/ContactSection.jsx
import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./ContactSection.css";
import contactImage from "../assets/contact-img.svg";
import { sendContact } from "../services/contactService";

function validate(values) {
  const errors = {};
  // Name
  if (!values.name || values.name.trim().length < 2) {
    errors.name = "Please enter at least 2 characters.";
  }
  // Email
  const email = values.email?.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) errors.email = "Please enter a valid email.";
  }
  // Message
  if (!values.message || values.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }
  return errors;
}

function ContactSection() {
  const nameId = useId();
  const emailId = useId();
  const msgId = useId();

  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [serverError, setServerError] = useState("");

  // Track toast timer so we can clear it on unmount / re-submit
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, []);

  // Compute validation errors once whenever values change
  const validationErrors = useMemo(() => validate(values), [values]);

  // Derive isValid from validationErrors
  const isValid = Object.keys(validationErrors).length === 0;

  function onChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

    // live-clear just this field’s error (only if it exists in submitted errors)
    if (formErrors[e.target.name]) {
      setFormErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();

    const nextErrors = validationErrors;
    setFormErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await sendContact({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });

      setValues({ name: "", email: "", message: "" });
      setToast("Thanks for reaching out 💌");

      // Clear any existing toast timer before setting a new one
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }

      // Auto-hide after 4s (safe even if user navigates away)
      toastTimerRef.current = setTimeout(() => {
        setToast("");
        toastTimerRef.current = null;
      }, 4000);
    } catch (err) {
      setServerError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="contact-section">
      <h2 className="section-heading">We’re Listening</h2>
      <div className="contact-container">
        <div className="form-wrapper glass">
          <h3 className="form-heading">Send us a chat</h3>
          <p className="form-subtext">We’d love to hear from you!</p>

          {/* Success toast */}
          {toast && (
            <div
              role="status"
              aria-live="polite"
              className="banner banner-success"
            >
              {toast}
            </div>
          )}

          {/* Error banner */}
          {serverError && (
            <div
              role="alert"
              aria-live="assertive"
              className="banner banner-error"
            >
              {serverError}
            </div>
          )}

          <form className="contact-form" onSubmit={onSubmit} noValidate>
            {/* Name */}
            <div className="field">
              <label htmlFor={nameId} className="label">
                Name
              </label>
              <input
                id={nameId}
                type="text"
                name="name"
                placeholder="Your Name"
                className={`form-input${formErrors.name ? " has-error" : ""}`}
                value={values.name}
                onChange={onChange}
                autoComplete="name"
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? `${nameId}-err` : undefined}
                required
              />
              {formErrors.name && (
                <p id={`${nameId}-err`} className="field-error">
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="field">
              <label htmlFor={emailId} className="label">
                Email
              </label>
              <input
                id={emailId}
                type="email"
                name="email"
                placeholder="Your Email"
                className={`form-input${formErrors.email ? " has-error" : ""}`}
                value={values.email}
                onChange={onChange}
                autoComplete="email"
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? `${emailId}-err` : undefined}
                required
              />
              {formErrors.email && (
                <p id={`${emailId}-err`} className="field-error">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="field">
              <label htmlFor={msgId} className="label">
                Message
              </label>
              <textarea
                id={msgId}
                name="message"
                placeholder="Your Message"
                className={`form-textarea${formErrors.message ? " has-error" : ""}`}
                rows="5"
                value={values.message}
                onChange={onChange}
                aria-invalid={!!formErrors.message}
                aria-describedby={formErrors.message ? `${msgId}-err` : undefined}
                required
              />
              {formErrors.message && (
                <p id={`${msgId}-err`} className="field-error">
                  {formErrors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="form-button"
              disabled={!isValid || submitting}
              aria-busy={submitting ? "true" : "false"}
            >
              {submitting ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>

        <div className="image-wrapper hide-on-mobile">
          <img
            src={contactImage}
            alt="Contact Illustration"
            className="contact-image"
          />
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
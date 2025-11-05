// src/components/ContactSection.jsx
import { useId, useMemo, useState } from "react";
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
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [serverError, setServerError] = useState("");

  const isValid = useMemo(
    () => Object.keys(validate(values)).length === 0,
    [values]
  );

  function onChange(e) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      // live-clear just this field’s error
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
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
      // Auto-hide after 4s
      setTimeout(() => setToast(""), 4000);
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
                className={`form-input${errors.name ? " has-error" : ""}`}
                value={values.name}
                onChange={onChange}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${nameId}-err` : undefined}
                required
              />
              {errors.name && (
                <p id={`${nameId}-err`} className="field-error">
                  {errors.name}
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
                className={`form-input${errors.email ? " has-error" : ""}`}
                value={values.email}
                onChange={onChange}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${emailId}-err` : undefined}
                required
              />
              {errors.email && (
                <p id={`${emailId}-err`} className="field-error">
                  {errors.email}
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
                className={`form-textarea${errors.message ? " has-error" : ""}`}
                rows="5"
                value={values.message}
                onChange={onChange}
                aria-invalid={!!errors.message}
                aria-describedby={
                  errors.message ? `${msgId}-err` : undefined
                }
                required
              />
              {errors.message && (
                <p id={`${msgId}-err`} className="field-error">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="form-button"
              disabled={submitting}
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

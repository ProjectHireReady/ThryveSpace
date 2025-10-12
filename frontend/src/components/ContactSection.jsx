import "./ContactSection.css";
import contactImage from "../assets/contact-img.svg";

function ContactSection() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };
    console.log("Contact form submitted:", data);
    form.reset();
  };

  return (
    <section className="contact-section">
      <h2 className="section-heading">We’re Listening</h2>{" "}
      {/* main section header */}
      <div className="contact-container">
        <div className="form-wrapper glass">
          <h3 className="form-heading">Send us a chat</h3>{" "}
          {/* form-specific heading */}
          <p className="form-subtext">We’d love to hear from you!</p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="form-input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="form-input"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              className="form-textarea"
              rows="5"
              required
            ></textarea>

            <button type="submit" className="form-button">
              Send Message
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

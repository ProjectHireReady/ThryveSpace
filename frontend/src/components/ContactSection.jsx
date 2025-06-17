import "./ContactSection.css";
import contactImage from "../assets/contact-img.svg";

function ContactSection() {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="image-wrapper">
          <img
            src={contactImage}
            alt="Contact Illustration"
            className="contact-image"
          />
        </div>

        <div className="form-wrapper glass">
          <h2 className="form-heading">Send us a chat</h2>
          <p className="form-subtext">We’d love to hear from you!</p>

          <form className="contact-form">
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
      </div>
    </section>
  );
}

export default ContactSection;

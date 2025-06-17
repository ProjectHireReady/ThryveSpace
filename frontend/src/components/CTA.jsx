import "./CTA.css";
import ctaImage from "../assets/meditation.svg";

function CTA() {
  return (
    <section className="cta-container">
      <img src={ctaImage} alt="Meditation Illustration" className="cta-image" />
      <button className="cta-button button">Start Your Journey</button>
    </section>
  );
}

export default CTA;

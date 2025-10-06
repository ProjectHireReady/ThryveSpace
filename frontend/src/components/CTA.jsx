import { Link } from 'react-router-dom';
import "./CTA.css";
import ctaImage from "../assets/meditation.svg";

function CTA() {
  return (
    <section className="cta-container section section--sm-top-heavy">
      <img src={ctaImage} alt="Meditation Illustration" className="cta-image" />
      <Link to="/mood">
        <button className="cta-button button">Start Your Journey</button>
      </Link>
    </section>
  );
}

export default CTA;

import { Link } from "react-router-dom";

import "./FeaturesPreview.css";
import {
  FiBarChart2,
  FiSmile,
  FiUserCheck,
  FiArrowUpRight,
} from "react-icons/fi";

function FeaturesPreview() {
  return (
    <section className="features-preview-alt">
      <div className="features-alt-container">
        <div className="features-alt-text">
          <div className="text-header-accent">
            <span className="accent-dot" /> {/* small glow or line */}
            <h2>Explore Features</h2>
          </div>

          <p className="features-subtext">
            A quick glance at how we support your journey
          </p>

          <Link to="/features" className="features-button">
            Discover More <FiArrowUpRight className="arrow" />
          </Link>
        </div>

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon">
              <FiBarChart2 size={24} />
            </div>
            <div className="timeline-content">
              <h4>AI insights for deeper understanding</h4>
              <p>
                Our AI helps you see mood patterns and offer gentle personalized
                suggestions. It acts as a helpful companion to you.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon">
              <FiSmile size={24} />
            </div>
            <div className="timeline-content">
              <h4>Gentle guidance you can trust</h4>
              <p>
                Subtle check-ins and reminders keep your emotional well-being
                top-of-mind — but always on your terms.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon">
              <FiUserCheck size={24} />
            </div>
            <div className="timeline-content">
              <h4>Personalized experience</h4>
              <p>
                Our features adapt to your behavior and preferences, giving you
                a more intuitive and helpful daily companion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesPreview;

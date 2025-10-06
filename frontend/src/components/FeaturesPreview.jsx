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
    <section className="features-preview-alt section section--sm">
      <div className="features-alt-container">
        {/* Intro Text */}
        <div className="features-alt-text">
          <div className="text-header-accent">
            <span className="accent-dot" />
            <h2>Explore Features</h2>
          </div>

          <p className="features-subtext">
            Every journey starts with understanding. Here’s how our platform
            guides you toward better emotional awareness, adapts to your unique
            behavior, and offers practical insights to help you thrive every day
          </p>

          <Link to="/features" className="features-button">
            Discover More <FiArrowUpRight className="arrow" />
          </Link>
        </div>

        {/* Timeline Section */}
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon">
              <FiBarChart2 size={24} />
            </div>
            <div className="timeline-content">
              <h4>AI insights for deeper understanding</h4>
              <p>
                Our AI identifies mood patterns and provides subtle,
                personalized suggestions to help you reflect and grow.
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
                Thoughtful check-ins and reminders keep your emotional
                well-being top-of-mind, always respecting your pace.
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
                Features adapt to your habits and preferences, creating a more
                intuitive and supportive daily companion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesPreview;

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
          <h2>Explore Features</h2>
          <p className="features-subtext">
            A quick glance at how we support your journey
          </p>
          <button className="features-button">
            Discover More <FiArrowUpRight className="arrow" />
          </button>
        </div>

        <div className="features-alt-items">
          <div className="feature-row">
            <FiBarChart2 className="feature-icon" size={28} />
            <div>
              <h4>AI insights for deeper understanding</h4>
              <p>
                Our AI helps you see mood patterns and offer gentle personalized
                suggestions. It acts as a helpful companion to you.
              </p>
            </div>
          </div>

          <div className="feature-row">
            <FiSmile className="feature-icon" size={28} />
            <div>
              <h4>Gentle guidance you can trust</h4>
              <p>
                Subtle check-ins and reminders keep your emotional well-being
                top-of-mind — but always on your terms.
              </p>
            </div>
          </div>

          <div className="feature-row">
            <FiUserCheck className="feature-icon" size={28} />
            <div>
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

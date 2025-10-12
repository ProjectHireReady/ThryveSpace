import Footer from "../components/Footer.jsx";
import psychologist from "../assets/psychologist.svg";
import leafSvg from "../assets/leaf.svg";
import "./About.css";

export default function About() {
  return (
    <>
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-block about-hero">
          <h1 className="about-title">About ThryveSpace</h1>
          <p className="about-subtitle">
            Empowering your mental wellness journey with tools, support, and
            insights designed to help you thrive.
          </p>
          <img
            src={psychologist}
            alt="Psychologist"
            className="about-psychologist"
            loading="lazy"
          />
        </section>

        {/* Mission */}
        <section className="about-block">
          <div className="about-header">
            <img src={leafSvg} alt="Leaf icon" className="about-icon" />
            <h2 className="about-heading">Our Mission</h2>
          </div>
          <div className="about-content">
            <div className="about-circle-outer">
              <div className="about-circle-inner">1</div>
            </div>
            <div>
              <h3 className="about-subheading">Our Mission</h3>
              <p>
                Make emotional well-being accessible and understandable.
                Empowering you with simple, private, intelligent tools for
                self-awareness and resilience.
              </p>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="about-block">
          <div className="about-header">
            <img src={leafSvg} alt="Leaf icon" className="about-icon" />
            <h2 className="about-heading">What Makes Us Different</h2>
          </div>
          <div className="about-content">
            <div className="about-circle-outer">
              <div className="about-circle-inner">2</div>
            </div>
            <div>
              <h3 className="about-subheading">More Than a Mood Tracker</h3>
              <p>
                Proactive AI mood forecasting with personalized, gentle
                suggestions. Focus on privacy (local-first data) and a
                supportive, non-clinical environment.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="about-block">
          <div className="about-header">
            <img src={leafSvg} alt="Leaf icon" className="about-icon" />
            <h2 className="about-heading">Our Values Keywords</h2>
          </div>
          <div className="about-content">
            <div className="about-circle-outer">
              <div className="about-circle-inner">3</div>
            </div>
            <div>
              <h3 className="about-subheading">Our Principles</h3>
              <ul>
                <li>Empathy & Kindness</li>
                <li>Privacy & Trust</li>
                <li>Simplicity & Clarity</li>
                <li>Empowerment & Growth</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="about-block">
          <div className="about-header">
            <img src={leafSvg} alt="Leaf icon" className="about-icon" />
            <h2 className="about-heading">Our Story</h2>
          </div>
          <div className="about-content">
            <div className="about-circle-outer">
              <div className="about-circle-inner">4</div>
            </div>
            <div>
              <h3 className="about-subheading">How ThryveSpace Began</h3>
              <p>
                ThryveSpace was created by a small team passionate about making
                mental health tools approachable and stigma-free. What started
                as a personal idea to help people track their emotions safely
                grew into a digital companion for emotional awareness and
                growth.
              </p>
            </div>
          </div>
        </section>

        {/* Our Vision */}
        <section className="about-block">
          <div className="about-header">
            <img src={leafSvg} alt="Leaf icon" className="about-icon" />
            <h2 className="about-heading">Our Vision</h2>
          </div>
          <div className="about-content">
            <div className="about-circle-outer">
              <div className="about-circle-inner">5</div>
            </div>
            <div>
              <h3 className="about-subheading">
                Building a Kinder Digital Future
              </h3>
              <p>
                We envision a world where digital spaces nurture mental wellness
                rather than drain it, where technology empowers people to
                understand themselves, build resilience, and feel safe
                expressing their emotions.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

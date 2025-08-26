// FeaturesPage.jsx
import Footer from "../components/Footer";

// Image Imports
import moodTrackingSvg from "../assets/features/mood-track.svg";
import aiSvg from "../assets/features/ai.svg";
import noPressureSvg from "../assets/features/no-pressure.svg";
import personalSvg from "../assets/features/personal.svg";
import privacySvg from "../assets/features/privacy.svg";

// Icon Imports
import { Smiley, SmileyMeh, SmileySad } from "phosphor-react";

import "./FeaturesPage.css";

function FeaturesPage() {
  return (
    <>
      <main>
        {/* Hero Section */}
        <section className="hero-section container">
          <h1>ThryveSpace Features</h1>
          <p>
            Discover the powerful tools designed to help you understand and
            manage your emotional landscape, all with your privacy in mind.
          </p>
        </section>

        {/* Feature Sections */}
        <section className="feature-section container">
          <div className="feature-content">
            <h2>Mood Tracking</h2>
            <h3>Intuitive Mood Tracking</h3>
            <p>
              Log feelings easily with emojis or slider. Add private notes.
              Build your emotional landscape. See patterns, gain self-awareness.
              Process experiences privately.
            </p>
            {/* <p className="emojis">&#128515; &#128522; &#128532;</p> */}
            <div className="emojis">
              <Smiley
                className="emoji happy"
                weight="fill"
                aria-label="Happy mood"
                title="Happy mood"
              />
              <SmileyMeh
                className="emoji neutral"
                weight="regular"
                aria-label="Neutral mood"
                title="Neutral mood"
              />
              <SmileySad
                className="emoji sad"
                weight="duotone"
                aria-label="Sad mood"
                title="Sad mood"
              />
            </div>
          </div>
          <div className="feature-image">
            <img src={moodTrackingSvg} alt="Mood Tracking" />
          </div>
        </section>

        <section className="feature-section container reverse">
          <div className="feature-content">
            <h2>AI-Powered Mood Prediction</h2>
            <h3>AI mood prediction and insights</h3>
            <p>
              Analyzes mood entries for trends. Offers gentle, proactive
              suggestions & personalized insights. Prepare for emotional dips,
              reinforce positive habits. Empowering, proactive self care.
            </p>
          </div>
          <div className="feature-image">
            <img src={aiSvg} alt="AI-Powered Mood Prediction" />
          </div>
        </section>

        <section className="feature-section container">
          <div className="feature-content">
            <h2>No-Pressure Sign-Up</h2>
            <h3>Start instantly, no account needed</h3>
            <p>
              Full features, no login required. Data saved locally and
              privately. Explore freely, no commitment. Comfort and control from
              the start.
            </p>
          </div>
          <div className="feature-image">
            <img src={noPressureSvg} alt="No-Pressure Sign-Up" />
          </div>
        </section>

        <section className="feature-section container reverse">
          <div className="feature-content">
            <h2>Personal Journal</h2>
            <h3>Your safe space to reflect</h3>
            <p>
              A dedicated, private journal to think freely, reduce stress, and
              find clarity. Write at your own pace. A gentle, supportive habit —
              fully yours.
            </p>
          </div>
          <div className="feature-image">
            <img src={personalSvg} alt="Personal Journal" />
          </div>
        </section>

        <section className="feature-section container">
          <div className="feature-content">
            <h2>Privacy & Security</h2>
            <h3>Your privacy, our priority</h3>
            <p>
              Data stored locally by default. Optional secure account for
              backup/sync. We never sell your data. Feel safe. Focus on
              well-being with peace of mind.
            </p>
          </div>
          <div className="feature-image">
            <img src={privacySvg} alt="Privacy & Security" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default FeaturesPage;

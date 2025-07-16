import React from 'react';

// Import your images from the new assets folder
import moodTrackingSvg from './assets/images/mood-tracking.svg';
import aiSvg from './assets/images/AI.svg';
import noPressureSvg from './assets/images/No-pressure.svg';
import personalSvg from './assets/images/Personal.svg';
import privacySvg from './assets/images/Privacy.svg';

// This is the component for the ThryveSpace Features page
function FeaturesPage() {
  return (
    <>
      {/* My CSS styles are all here, keeping them self-contained for this component for now */}
      <style>
        {`
        /* Basic Resets and Global Styles for this page's content */
        :root {
            --primary-blue: #5A90C5; /* This is the main blue color I'm using */
            --text-dark: #333;
            --text-light: #666; /* This light grey is for body text and those secondary headlines */
            --background-light: #f9f9f9; /* Just a light background color */
            --line-blue: #A7D9F8; /* This is the light blue for all the dividing lines */
            --max-width: 1200px;
            --padding-x: 20px;
            --section-padding-y: 80px; /* Vertical padding for each section */
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            /* Note: body styles here might be overridden by global.css or main.jsx body styles.
               These are primarily for ensuring consistency if this component were standalone. */
            font-family: 'Inter', sans-serif; /* My default font for the whole page */
            line-height: 1.6;
            color: var(--text-dark);
            background-color: #fff; /* Keeping the page background white */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* This container helps center my content and keeps it from getting too wide */
        .container {
            max-width: var(--max-width);
            margin: 0 auto;
            padding: 0 var(--padding-x);
        }

        /* Main Content Sections */
        .feature-section {
            padding: var(--section-padding-y) var(--padding-x);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 60px; /* Space between the text and the image */
            border-bottom: 1px solid var(--line-blue); /* The blue horizontal line */
        }

        /* Don't want a border on the very last feature section */
        .feature-section:last-of-type {
            border-bottom: none;
        }

        .feature-content {
            flex: 1; /* Lets the text content take up available space */
            max-width: 50%; /* Limiting the text width a bit */
        }

        .feature-content h2 {
            font-size: 2.5rem; /* The main feature title size */
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--text-dark);
            border-radius: 4px;
        }

        .feature-content h3 {
            font-size: 1.5rem; /* The subtitle size */
            font-weight: 500;
            margin-bottom: 20px;
            color: var(--text-light); /* This is the light grey for the secondary headlines */
            border-radius: 44px; /* Not sure why 44px, but keeping it as is */
        }

        .feature-content p {
            font-size: 1rem;
            color: var(--text-light);
            line-height: 1.8;
            border-radius: 4px;
        }

        /* Styling for the emoji line in the Mood Tracking section */
        .feature-content .emojis {
            margin-top: 15px; /* Space above the emojis */
            font-size: 1.5rem; /* Making the emojis a bit larger */
            color: var(--text-dark); /* Keeping the emojis dark */
            display: flex; /* Using flex to space them out */
            gap: 15px; /* Space between each emoji */
            /* Default alignment for sections where text is on the left */
            justify-content: flex-start;
        }
        /* If the section is reversed (image left, text right), align emojis to the right */
        .feature-section.reverse .feature-content .emojis {
            justify-content: flex-end;
        }


        .feature-image {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 50%; /* Limiting the image width a bit */
        }

        .feature-image img {
            max-width: 100%;
            height: auto;
            display: block;
            border-radius: 8px; /* Rounded corners for the images */
            box-shadow: 0 4px 10px rgba(0,0,0,0.1); /* A subtle shadow for the images */
        }

        /* This class is for sections where I want the image on the left and text on the right */
        .feature-section.reverse {
            flex-direction: row-reverse;
        }

        /* Specific styling for the very first section (ThryveSpace Features intro) */
        .hero-section {
            text-align: center;
            padding-top: var(--section-padding-y);
            padding-bottom: var(--section-padding-y);
            border-bottom: 1px solid var(--line-blue); /* The blue line below this section */
        }

        .hero-section h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--primary-blue); /* This heading is blue */
            border-radius: 4px;
        }

        .hero-section p {
            max-width: 800px;
            margin: 0 auto 40px;
            font-size: 1.1rem;
            color: var(--text-light);
            border-radius: 4px;
        }

        /* Styling for the footer at the very bottom */
        footer {
            background-color: var(--primary-blue); /* Making the footer blue */
            color: #fff; /* White text for the footer */
            text-align: right; /* Keeping the footer text aligned to the right */
            padding: 30px var(--padding-x);
            font-size: 0.9rem;
            border-top: 1px solid var(--line-blue);
            border-radius: 8px 8px 0 0; /* Rounded top corners for the footer */
            margin-top: 50px; /* Some space above the footer */
        }

        /* Responsive adjustments for different screen sizes */
        @media (max-width: 992px) {
            .feature-section {
                flex-direction: column; /* Stacking content vertically on smaller screens */
                text-align: center;
                gap: 40px;
            }

            .feature-content,
            .feature-image {
                max-width: 100%; /* Letting content take full width on smaller screens */
            }

            .feature-content h2 {
                font-size: 2rem;
            }

            .feature-content h3 {
                font-size: 1.3rem;
            }

            .hero-section h1 {
                font-size: 2.5rem;
            }

            /* Centering emojis when the layout stacks vertically */
            .feature-content .emojis {
                justify-content: center;
            }
        }

        @media (max-width: 768px) {
            /* Removed header-specific responsive styles */
            .feature-section {
                padding: 60px var(--padding-x);
            }

            .hero-section h1 {
                font-size: 2rem;
            }

            .hero-section p {
                font-size: 1rem;
            }
        }

        @media (max-width: 480px) {
            :root {
                --padding-x: 15px;
                --section-padding-y: 50px;
            }

            nav ul {
                gap: 15px;
            }

            nav ul li a {
                font-size: 0.9rem;
            }

            .feature-content h2 {
                font-size: 1.8rem;
            }

            .feature-content h3 {
                font-size: 1.1rem;
            }

            .feature-content p {
                font-size: 0.9rem;
            }

            .hero-section h1 {
                font-size: 1.8rem;
            }
        }
        `}
      </style>

      {/* The Header Section has been removed from here, as it's handled by the global NavBar. */}

      {/* Main Content Area */}
      <main>
        {/* Hero Section: ThryveSpace Features */}
        <section className="hero-section container">
          <h1>ThryveSpace Features</h1>
          <p>Discover the powerful tools designed to help you understand and manage your emotional landscape, all with your privacy in mind.</p>
        </section>

        {/* Feature 1: Mood Tracking (Text Left, Image Right) */}
        <section className="feature-section container">
          <div className="feature-content">
            <h2>Mood Tracking</h2>
            <h3>Intuitive Mood Tracking</h3>
            <p>Log feelings easily with emojis or slider. Add private notes. Build your emotional landscape. See patterns, gain self-awareness. Process experiences privately.</p>
            {/* Emojis on a new line, original style */}
            <p className="emojis">&#128515; &#128522; &#128532;</p>
          </div>
          <div className="feature-image">
            {/* Image path now uses the imported variable */}
            <img src={moodTrackingSvg} alt="Mood Tracking" />
          </div>
        </section>

        {/* Feature 2: AI-Powered Mood Prediction (Image Left, Text Right) */}
        <section className="feature-section container reverse">
          <div className="feature-content">
            <h2>AI-Powered Mood Prediction</h2>
            <h3>AI mood prediction and insights</h3>
            <p>Analyzes mood entries for trends. Offers gentle, proactive suggestions & personalized insights. Prepare for emotional dips, reinforce positive habits. Empowering, proactive self care.</p>
          </div>
          <div className="feature-image">
            {/* Image path now uses the imported variable */}
            <img src={aiSvg} alt="AI-Powered Mood Prediction" />
          </div>
        </section>

        {/* Feature 3: No-Pressure Sign-Up (Text Left, Image Right) */}
        <section className="feature-section container">
          <div className="feature-content">
            <h2>No-Pressure Sign-Up</h2>
            <h3>Start instantly, no account needed</h3>
            <p>Full features, no login required. Data saved locally and privately. Explore freely, no commitment. Comfort and control from the start.</p>
          </div>
          <div className="feature-image">
            {/* Image path now uses the imported variable */}
            <img src={noPressureSvg} alt="No-Pressure Sign-Up" />
          </div>
        </section>

        {/* Feature 4: Personal Journal (Image Left, Text Right) */}
        <section className="feature-section container reverse">
          <div className="feature-content">
            <h2>Personal Journal</h2>
            <h3>Your private journal</h3>
            <p>A dedicated, private space to reflect deeply. Write freely, anytime. Powerful for self-reflection, stress reduction, clarity. Cultivate this habit securely.</p>
          </div>
          <div className="feature-image">
            {/* Image path now uses the imported variable */}
            <img src={personalSvg} alt="Personal Journal" />
          </div>
        </section>

        {/* Feature 5: Privacy & Security (Text Left, Image Right) */}
        <section className="feature-section container">
          <div className="feature-content">
            <h2>Privacy & Security</h2>
            <h3>Your privacy, our priority</h3>
            <p>Data stored locally by default. Optional secure account for backup/sync. We never sell your data. Feel safe. Focus on well-being with peace of mind.</p>
          </div>
          <div className="feature-image">
            {/* Image path now uses the imported variable */}
            <img src={privacySvg} alt="Privacy & Security" />
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer>
        <div className="container">
          <p>&copy; 2025 ThryveSpace</p>
        </div>
      </footer>
    </>
  );
}

export default FeaturesPage;

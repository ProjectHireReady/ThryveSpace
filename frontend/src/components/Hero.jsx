// Hero.jsx
import { useEffect } from "react";
import heroBg from "../assets/hero-img.svg";
import "./Hero.css";

function Hero() {
  useEffect(() => {
    const img = new Image();
    img.src = heroBg;
  }, []);

  return (
    <section className="hero section">
      <img src={heroBg} alt="Hero background" className="hero-bg-img" />
      <div className="overlay"></div>
      <div className="hero-content">
        <div className="text-group">
          <h1>Mental Wellness Companion</h1>
          <p>
            Track moods, reflect, gain insights. <br />
            A private gentle space for you.
          </p>
          <button className="hero-btn button">Track Mood</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;

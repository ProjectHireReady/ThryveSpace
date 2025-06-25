// Hero.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom"; //navigate to mood screen
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
          <h1>Mental Wellness Buddy</h1>
          <p>
            Track moods. reflect calmly. <br />A private gentle space for you.
          </p>

          <Link to="/mood">
            <button className="hero-btn button">Track Mood</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import "./DailyUplifts.css";

// Import card SVGs
import mindfulIcon from "../assets/flower.svg";
import winsIcon from "../assets/champion.svg";
import wellnessIcon from "../assets/wellness.svg";

function DailyUplifts() {
  const uplifts = [
    {
      id: "mindful",
      title: "Mindful Moments",
      text: "Start your day with a smile and a clear intention.",
      colorClass: "bg-mint",
      icon: mindfulIcon,
    },
    {
      id: "wins",
      title: "Small Wins",
      text: "Celebrate the little things. They add up to something big.",
      colorClass: "bg-peach",
      icon: winsIcon,
    },
    {
      id: "wellness",
      title: "Wellness Tips",
      text: "Even on cloudy days, you can still glow.",
      colorClass: "bg-babyblue",
      icon: wellnessIcon,
    },
    {
      id: "breathe",
      title: "Just Breathe",
      text: "Inhale strength. Exhale stress.",
      colorClass: "bg-lavender",
    },
    {
      id: "youve-got-this",
      title: "You've Got This",
      text: "Remember how far you’ve come.",
      colorClass: "bg-yellow",
    },
    {
      id: "keep-moving",
      title: "Keep Moving",
      text: "Progress, not perfection.",
      colorClass: "bg-airyblue",
    },
  ];

  return (
    <section className="daily-uplifts section">
      <div className="uplifts-container">
        <h2 className="uplifts-header">Daily Uplifts</h2>

        <div className="uplifts-grid-wrapper">
          <div className="uplifts-grid">
            {uplifts.slice(0, 3).map((item) => (
              <div key={item.id} className={`uplift-card ${item.colorClass}`}>
                <img
                  src={item.icon}
                  alt={`${item.title} icon`}
                  className="uplift-icon"
                />
                <h3 className="uplift-title">{item.title}</h3>
                <p className="uplift-text">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="uplift-arrows">
            <button className="uplift-arrow" aria-label="Previous uplift">
              <HiChevronLeft size={18} />
            </button>
            <button className="uplift-arrow" aria-label="Next uplift">
              <HiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DailyUplifts;

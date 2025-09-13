import { useState, useEffect } from "react";
import { getMoods } from "../api/moods";
import "./MoodSelector.css";

export default function MoodSelector({ onMoodSelect }) {
  const [moods, setMoods] = useState([]);
  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const pageSize = 8; // 4 per row × 2 rows

  useEffect(() => {
    const fetchMoods = async () => {
      setLoading(true);
      const data = await getMoods();
      setMoods(data);
      setLoading(false);
    };
    fetchMoods();
  }, []);

  const totalPages = Math.ceil(moods.length / pageSize);

  const changePage = (newPage) => {
    setAnimating(true);
    setTimeout(() => {
      setPage(newPage);
      setAnimating(false);
    }, 300);
  };

  const handleNext = () => {
    if (page < totalPages - 1) changePage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) changePage(page - 1);
  };

  const startIndex = page * pageSize;
  const visibleMoods = moods.slice(startIndex, startIndex + pageSize);

  return (
    <div className="mood-selector">
      <h2 className="mood-header">How are you feeling?</h2>
      <p className="subtext">Pick a mood that best describes you</p>

      {loading ? (
        <div className="loading-spinner">Loading moods...</div>
      ) : (
        <div className={`mood-grid ${animating ? "fade-out" : "fade-in"}`}>
          {visibleMoods.map((mood) => (
            <div
              key={mood.id}
              className="mood-item"
              onClick={() => onMoodSelect(mood)} // pass full object!
            >
              <img src={mood.imageUrl} alt={mood.name} />
              <p>{mood.name}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="button-container">
          {page > 0 && (
            <button className="scroll-button" onClick={handlePrev}>
              ↑ Previous moods
            </button>
          )}
          {page < totalPages - 1 && (
            <button className="scroll-button" onClick={handleNext}>
              ↓ Next moods
            </button>
          )}
        </div>
      )}
    </div>
  );
}

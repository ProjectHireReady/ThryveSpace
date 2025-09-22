// MoodSelector.jsx
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import "./MoodSelector.css";
import { getMoods } from "../api/moods";
import { guestMoods } from "../data/guestMoods";
import { useAuth } from "../context/AuthContext";

function MoodItem({ mood, disabled, selected, onSelect }) {
  return (
    <div
      className={`mood-item ${selected ? "selected" : ""}`}
      onClick={() => onSelect(mood)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(mood)}
      aria-label={`Select mood ${mood.name}`}
    >
      <img src={mood.imageUrl} alt={`Mood: ${mood.name}`} />
      <p className="mood-label">{mood.name}</p>
    </div>
  );
}

function PaginationButtons({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="button-container">
      {page > 0 && (
        <button className="scroll-button" onClick={onPrev}>
          <FaArrowUp /> Prev
        </button>
      )}
      {page < totalPages - 1 && (
        <button className="scroll-button" onClick={onNext}>
          Next <FaArrowDown />
        </button>
      )}
    </div>
  );
}

export default function MoodSelector({ onMoodSelect }) {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // guests get moods instantly, logged-in users fetch from API
  const [moods, setMoods] = useState(isLoggedIn ? [] : guestMoods);
  const [loading, setLoading] = useState(isLoggedIn);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const pageSize = 4;

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadMoods = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMoods();
        console.log("The moods are:", res.data);
        // ✅ FIX: use the moods array inside the object
        setMoods(res.data.moods || []);
      } catch (err) {
        console.error("Error fetching moods:", err);
        setError("Could not load moods. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadMoods();
  }, [isLoggedIn]);

  const totalPages = Math.ceil(moods.length / pageSize);

  const changePage = useCallback((newPage) => {
    setAnimating(true);
    setDisabled(false);
    setSelectedMood(null);

    setTimeout(() => {
      setPage(newPage);
      setAnimating(false);
    }, 300);
  }, []);

  const handleNext = useCallback(
    () => page < totalPages - 1 && changePage(page + 1),
    [page, totalPages, changePage]
  );

  const handlePrev = useCallback(
    () => page > 0 && changePage(page - 1),
    [page, changePage]
  );

  const handleSelect = useCallback(
    (mood) => {
      if (disabled) return;
      setDisabled(true);
      setSelectedMood(mood.id);
      onMoodSelect(mood);
    },
    [disabled, onMoodSelect]
  );

  const startIndex = page * pageSize;
  const visibleMoods = moods.slice(startIndex, startIndex + pageSize);

  return (
    <div className="mood-selector">
      <h1 className="mood-header">How are you feeling today?</h1>
      <h2 className="subtext">
        You can pick a mood or just write — whatever feels right today.
      </h2>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading moods...</p>
        </div>
      ) : error ? (
        <p className="mood-error-message">{error}</p>
      ) : moods.length === 0 ? (
        <p className="mood-empty-message">No moods available.</p>
      ) : (
        <>
          <div
            className={`mood-grid ${animating ? "fade-out" : "fade-in"} ${disabled ? "disabled" : ""
              }`}
          >
            {visibleMoods.map((mood) => (
              <MoodItem
                key={mood.id}
                mood={mood}
                disabled={disabled}
                selected={selectedMood === mood.id}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationButtons
              page={page}
              totalPages={totalPages}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
        </>
      )}
    </div>
  );
}

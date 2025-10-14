import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useState, useCallback } from "react";
import "./MoodSelector.css";
import { guestMoods } from "../data/guestMoods";
import { useAuth } from "../context/AuthContext";
import { useMoods } from "../context/MoodContext";
import { useMoodHelpers } from "../utils/moodHelper";

function MoodItem({ mood, disabled, selected, onSelect }) {
  return (
    <div
      className={`mood-item ${selected ? "selected" : ""}`}
      onClick={() => onSelect(mood)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && onSelect(mood)
      }
      aria-label={`Select mood ${mood.name}`}
    >
      <img src={mood.icon} alt={`Mood: ${mood.name}`} />
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
  const { isAuthenticated: isLoggedIn } = useAuth();
  const { getAllMoods } = useMoodHelpers();
  const { loading: moodsLoading } = useMoods();

  const [disabled, setDisabled] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const pageSize = 4;

  const moods = isLoggedIn ? getAllMoods() : guestMoods;
  const totalPages = Math.ceil(moods.length / pageSize);
  const startIndex = page * pageSize;
  const visibleMoods = moods.slice(startIndex, startIndex + pageSize);

  const handleSelect = useCallback(
    (mood) => {
      if (disabled) return;
      setDisabled(true);
      setSelectedMood(mood.id);
      onMoodSelect(mood);
    },
    [disabled, onMoodSelect]
  );

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

  return (
    <div className="mood-selector">
      <h1 className="mood-header">How are you feeling today?</h1>
      <h2 className="subtext">
        You can pick a mood or just write — whatever feels right today.
      </h2>

      {isLoggedIn && moodsLoading && (
        <p className="mood-loading-message">Loading moods...</p>
      )}

      {moods && moods.length > 0 ? (
        <>
          <div
            className={`mood-grid ${animating ? "fade-out" : "fade-in"} ${
              disabled ? "disabled" : ""
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
      ) : (
        <div className="mood-empty-wrapper">
          <p className="mood-empty-message">No moods available</p>
        </div>
      )}
    </div>
  );
}

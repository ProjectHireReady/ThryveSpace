import { useEffect, useState } from "react";
import "./MoodSelector.css";
import { getMoods } from "../api/moods";
import { guestMoods } from "../data/guestMoods";
import { useAuth } from "../context/AuthContext";

export default function MoodSelector({ onMoodSelect }) {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const loadMoods = async () => {
      if (isLoggedIn) {
        try {
          const res = await getMoods();
          setMoods(res.data);
        } catch (err) {
          setError("Could not load moods.");
        }
      } else {
        setMoods(guestMoods); // Local fallback
      }
      setLoading(false);
    };

    loadMoods();
  }, [isLoggedIn]);

  const handleSelect = (mood) => {
    if (disabled) return;
    setDisabled(true);
    onMoodSelect(mood);
  };

  return (
    <div className="mood-selector">
      <h1 className="mood-header">How are you feeling today?</h1>
      <h2 className="subtext">
        You can pick a mood or just write — whatever feels right today.
      </h2>

      {loading && <p className="mood-loading-message">Loading moods...</p>}
      {error && <p className="mood-error-message">{error}</p>}

      <div className={`mood-grid ${disabled ? "disabled" : ""}`}>
        {!loading &&
          moods.map((mood) => (
            <div
              key={mood.id}
              className="mood-item"
              onClick={() => handleSelect(mood)}
              role="button"
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handleSelect(mood)
              }
              aria-label={`Select mood ${mood.name}`}
            >
              <img src={mood.imageUrl} alt={`Mood: ${mood.name}`} />
              <p className="mood-label">{mood.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

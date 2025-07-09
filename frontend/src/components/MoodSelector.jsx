import { useEffect, useState } from 'react';
import './MoodSelector.css';
import { getMoods } from '../api/moods';

// MoodSelector lets the user choose a mood and passes it to the parent
export default function MoodSelector({ onMoodSelect }) {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // Load moods from the backend when the component mounts
  useEffect(() => {
    getMoods()
      .then((res) => setMoods(res.data))
      .catch(() => setError('Could not load moods.'))
      .finally(() => setLoading(false));
  }, []);

  // Handle mood selection and prevent multiple clicks
  const handleSelect = (mood) => {
    if (disabled) return;
    setDisabled(true);
    onMoodSelect(mood); // Send selected mood to parent
  };

  return (
    <div className="mood-selector">
      <h1 className="mood-header">How are you feeling today?</h1>
      <h2 className="subtext">You can pick a mood or just write — whatever feels right today.</h2>

      {loading && <p className="mood-loading-message">Loading moods...</p>}
      {error && <p className="mood-error-message">{error}</p>}

      <div className={`mood-grid ${disabled ? 'disabled' : ''}`}>
        {!loading &&
          moods.map((mood) => (
            <div
              key={mood.id}
              className="mood-item"
              onClick={() => handleSelect(mood)}
              role="button"
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(mood)}
              aria-label={`Select mood ${mood.name}`}
            >
              <img src={mood.image_url} alt={`Mood: ${mood.name}`} />
              <p className="mood-label">{mood.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

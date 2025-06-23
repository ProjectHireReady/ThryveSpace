import happy from '../assets/moods/happy.png';
import sad from '../assets/moods/low.webp';
import angry from '../assets/moods/angry.webp';
import calm from '../assets/moods/calm.webp';
import './MoodSelector.css';

const moods = [
  { label: 'Happy', emoji: '😊', image: happy },
  { label: 'Sad', emoji: '😢', image: sad },
  { label: 'Angry', emoji: '😠', image: angry },
  { label: 'Calm', emoji: '😌', image: calm },
];

export default function MoodSelector({ onMoodSelect }) {
  return (
    <div className="mood-selector">
      <h1 className="mood-header">How are you feeling today?</h1>
      <h2 className="subtext">
        You can pick a mood or just write — whatever feels right today.
      </h2>

      <div className="mood-grid">
        {moods.map((mood, index) => (
          <div
            key={index}
            className="mood-item"
            style={{ cursor: 'pointer', textAlign: 'center' }}
            onClick={() => onMoodSelect(mood)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onMoodSelect(mood);
              }
            }}
            aria-label={`Select mood ${mood.label}`}
          >
            <img src={mood.image} alt={mood.label} />
            <p className="mood-label">{mood.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

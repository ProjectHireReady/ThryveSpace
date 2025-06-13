import { useNavigate } from 'react-router-dom';
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

export default function MoodSelector() {
  const navigate = useNavigate();

  const handleClick = (mood) => {
    navigate('/journals', { state: { mood } }); // Sends selected mood to the next page
  };

  return (
    <div className="container">
      <h1 className="h0">How are you feeling today?</h1>
      <h2 className="subtext">
        You can pick a mood or just write — whatever feels right today.
      </h2>

      <div className="mood-grid">
        {moods.map((mood, index) => (
          <div
            key={index}
            className="mood-item"
            onClick={() => handleClick(mood)}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <img
              src={mood.image}
              alt={mood.label}
            />
            <p>{mood.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

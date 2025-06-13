import React from 'react';
import { useNavigate } from 'react-router-dom';
import MoodSelector from '../components/MoodSelector';

const MoodsPage = () => {
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    // You can optionally pass mood state via route state
    navigate('/inputs', { state: { mood } });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <MoodSelector onMoodSelect={handleMoodSelect} />
    </div>
  );
};

export default MoodsPage;

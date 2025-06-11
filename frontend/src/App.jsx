import { Routes, Route } from 'react-router-dom';
import MoodsPage from './pages/moods';
import InputsPage from './pages/inputs';
import EntriesPage from './pages/entries';
import React from 'react';


function Home() {
  return <h2> Home Page (To be replaced)</h2>;
}

function About() {
  return <h2> About Page (To be replaced)</h2>;
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/moods" element={<MoodsPage />} />
      <Route path="/inputs" element={<InputsPage />} />
      <Route path="/entries" element={<EntriesPage />} />

    </Routes>
  );
}

export default App;
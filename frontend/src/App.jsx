import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/HomePage';
import MoodsPage from './pages/moods';
import JournalsPage from './pages/journals';
import EntriesPage from './pages/entries';

function App() {
  return (
    <>
      {/* Show navigation bar on all pages */}
      <NavBar />
      
      {/* Define routes for the app */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/moods" element={<MoodsPage />} />
        <Route path="/journals" element={<JournalsPage />} />
        <Route path="/entries" element={<EntriesPage />} />
      </Routes>
    </>
  );
}

export default App;

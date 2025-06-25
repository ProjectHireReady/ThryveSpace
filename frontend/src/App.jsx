import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/HomePage';
import MoodJournalPage from './pages/MoodJournalPage';
import EntriesPage from "./pages/EntriesPage";


function App() {
  return (
    <>
      {/* Show navigation bar on all pages */}
      <NavBar />
      
      {/* Define routes for the app */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mood" element={<MoodJournalPage />} />
        <Route path="/entries" element={<EntriesPage />} />
        </Routes>
    </>
  );
}

export default App;

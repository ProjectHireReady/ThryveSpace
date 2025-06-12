import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/HomePage';

function App() {
  return (
    <>
      {/* Show navigation bar on all pages */}
      <NavBar />
      
      {/* Define routes for the app */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;

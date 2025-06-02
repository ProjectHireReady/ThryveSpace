import { Routes, Route } from 'react-router-dom';

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
    </Routes>
  );
}

export default App;
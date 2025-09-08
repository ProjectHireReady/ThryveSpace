import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import MoodJournalPage from "./pages/MoodJournalPage";
import EntriesPage from "./pages/EntriesPage";
import PageTransition from "./components/PageTransition";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import InsightsPage from "./pages/InsightsPage";

function App() {
  return (
    <>
      {/* Show navigation bar on all pages */}
      <NavBar />

      {/* Define routes for the app */}
      <Routes>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />

        {/* Mood Page route */}
        <Route
          path="/mood"
          element={
            <PageTransition>
              <MoodJournalPage />
            </PageTransition>
          }
        />

        {/* Entries Page route */}
        <Route
          path="/entries"
          element={
            <PageTransition>
              <EntriesPage />
            </PageTransition>
          }
        />

        {/* Features Page route */}

        <Route
          path="/features"
          element={
            <PageTransition>
              <FeaturesPage />
            </PageTransition>
          }
        />

        {/* Login & Signup Page route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Insights Page route */}
        <Route
          path="/insights"
          element={
            <PageTransition>
              <InsightsPage />
            </PageTransition>
          }
        />
      </Routes>
    </>
  );
}

export default App;

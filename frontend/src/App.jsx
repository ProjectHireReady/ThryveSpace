import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import PageTransition from "./components/PageTransition";
import Home from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import MoodJournalPage from "./pages/MoodJournalPage";
import EntriesPage from "./pages/EntriesPage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import InsightsPage from "./pages/InsightsPage";

// Migration prompt + API
import MigrationPrompt from "./components/MigrationPrompt";
import { migrateGuestEntries } from "./utils/api";

function App() {
  // EXACT original initialization & logic
  const [guestEntries, setGuestEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("guest_entries")) || [];
    } catch {
      return [];
    }
  });
  const showPrompt = guestEntries.length > 0;

  const handleConfirm = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    await migrateGuestEntries(guestEntries, token);
    localStorage.removeItem("guest_entries");
    setGuestEntries([]);
  };

  const handleDecline = () => {
    localStorage.removeItem("guest_entries");
    setGuestEntries([]);
  };

  return (
    <>
      {/* Show navigation bar on all pages */}
      <NavBar />

      {/* Keep your original heading from the first snippet */}
      <h1>ThryveSpace</h1>

      {/* Original prompt condition */}
      {showPrompt && (
        <MigrationPrompt onConfirm={handleConfirm} onDecline={handleDecline} />
      )}

      {/* Defines Routes for the app */}
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


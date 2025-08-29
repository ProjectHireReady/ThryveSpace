import { useEffect, useMemo, useState } from "react";
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

// Auth & Entries context (per main.jsx / EntriesContext.jsx)
import { useAuth } from "./context/AuthContext";
import { useEntries } from "./context/EntriesContext";

// Migration prompt + API
import MigrationPrompt from "./components/MigrationPrompt";
import { migrateGuestEntries } from "./utils/api";

function App() {
  // Logged-in state
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // From EntriesContext 
  const { guestId, clearEntries } = useEntries();
  const guestStorageKey = `entries-${guestId}`;

  // Read the SAME local key EntriesContext uses for guest entries
  const localGuestEntries = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(guestStorageKey)) || [];
    } catch {
      return [];
    }
  }, [guestStorageKey]);

  // Only show prompt after login *and* if guest entries exist
  const shouldPrompt = isLoggedIn && localGuestEntries.length > 0;

  const [isMigrating, setIsMigrating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Toggle the prompt when conditions become true (side-effect → useEffect)
  useEffect(() => {
    setShowPrompt(shouldPrompt);
  }, [shouldPrompt]);

  const handleConfirm = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.warn("Missing auth_token — cannot migrate.");
      return;
    }

    try {
      setIsMigrating(true);

      // Map to backend contract if needed
      const payload = localGuestEntries.map((e) => ({
        note: e.note ?? e.text ?? "",
        mood_id: e.mood_id,
        created_at: e.created_at,
      }));

      await migrateGuestEntries(payload, token);

      // Purge local guest notes for this guestId
      clearEntries();

      setShowPrompt(false);
    } catch (e) {
      console.error("Migration failed:", e);
      // TODO: toast/notify if you have a system in place
    } finally {
      setIsMigrating(false);
    }
  };

  const handleDecline = () => {
    // User declines → remove local guest notes
    clearEntries();
    setShowPrompt(false);
  };

  return (
    <>
      {/* Show navigation bar on all pages */}
      <NavBar />

      {/* Optional heading */}
      <h1>ThryveSpace</h1>

      {/* Migration prompt */}
      {showPrompt && (
        <MigrationPrompt
          onConfirm={handleConfirm}
          onDecline={handleDecline}
          loading={isMigrating}
        />
      )}

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/mood"
          element={
            <PageTransition>
              <MoodJournalPage />
            </PageTransition>
          }
        />
        <Route
          path="/entries"
          element={
            <PageTransition>
              <EntriesPage />
            </PageTransition>
          }
        />
        <Route
          path="/features"
          element={
            <PageTransition>
              <FeaturesPage />
            </PageTransition>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
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

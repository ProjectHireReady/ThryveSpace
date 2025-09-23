import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import MoodJournalPage from "./pages/MoodJournalPage";
import EntriesPage from "./pages/EntriesPage";
import PageTransition from "./components/PageTransition";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
// import InsightsPage from "./pages/InsightsPage"; // 🔸 Commented out to avoid crash
import About from "./components/About";
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <div className="app">
      {/* Show navigation bar on all pages */}
      <NavBar />

      {/* Define routes for the app */}
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
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

          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
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

          {/* Insights page temporarily disabled */}
          {/*
          <Route
            path="/insights"
            element={
              <PageTransition>
                <InsightsPage />
              </PageTransition>
            }
          />
          */}

          {/* Protected routes - require authentication */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Guest-only routes (redirect if logged in) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignUpPage />
              </GuestRoute>
            }
          />

          {/* Special routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;


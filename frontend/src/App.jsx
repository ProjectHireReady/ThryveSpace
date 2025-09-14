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
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";

const UnauthorizedPage = () => (
  <PageTransition>
    <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
    </div>
  </PageTransition>
);

const NotFoundPage = () => (
  <PageTransition>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  </PageTransition>
);

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

          {/* Protected routes (require authentication) */}
          <Route 
            path="/mood" 
            element={
              <ProtectedRoute>
                <PageTransition>
                  <MoodJournalPage />
                </PageTransition>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/entries" 
            element={
              <ProtectedRoute>
                <PageTransition>
                  <EntriesPage />
                </PageTransition>
              </ProtectedRoute>
            } 
          />
          
          {/* Placeholder for future insights page */}
          {/*
          <Route 
            path="/insights" 
            element={
              <ProtectedRoute>
                <PageTransition>
                  <InsightsPage />
                </PageTransition>
              </ProtectedRoute>
            } 
          />
          */}

          {/* TODO: Add these routes when pages are created
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          */}

          {/* Special routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

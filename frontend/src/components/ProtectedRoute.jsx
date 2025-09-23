import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Component to protect routes that require authentication
export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user, loading, hasRole } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check for required role if specified
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ from: location, requiredRole }} 
        replace 
      />
    );
  }

  return children;
}

// Component to redirect authenticated users away from auth pages
export function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return null;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/mood" replace />;
  }

  return children;
}
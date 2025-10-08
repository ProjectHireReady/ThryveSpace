// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
} from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = guest
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Helper: save user & token after login/signup
  const handleAuthSuccess = (data) => {
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) setUser(data.user);
  };

  // Helper: redirect after successful auth
  const redirectAfterLogin = () => {
    // Get the intended destination from location state, or default to dashboard
    const from = location.state?.from?.pathname || "/mood";
    navigate(from, { replace: true });
  };

  // Helper: redirect after logout
  const redirectAfterLogout = () => {
    navigate("/", { replace: true });
  };

  // Restore user after reload
  useEffect(() => {
    const restoreUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setIsInitialized(true);
          return;
        }

        const data = await getCurrentUser(); // expects { user: {...}, token: ... } or just user
        if (data?.user) {
          setUser(data.user);
        } else {
          // Invalid token, clean up
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to restore user:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };
    if (!isInitialized) {
      restoreUser();
    }
  }, [isInitialized]);

  // Login
  const login = async (payload, options = {}) => {
    setAuthLoading(true);
    setError(null);
    try {
      const data = await loginUser(payload);
      handleAuthSuccess(data);
      if (!options.skipRedirect) redirectAfterLogin();
      return data;
    } catch (err) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Signup
  const signup = async (payload, options = {}) => {
    setAuthLoading(true);
    setError(null);
    try {
      const data = await signupUser(payload);
      return data;
    } catch (err) {
      const errorMessage = err.message || "Signup failed";
      setError(errorMessage);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout

  const logout = async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      await logoutUser(); // optional backend call
    } catch (err) {
      console.warn("Logout request failed:", err);
      // Don't throw - we still want to clear local state
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);

      // Only redirect if not disabled
      if (!options.skipRedirect) {
        redirectAfterLogout();
      }
    }
  };

  // Clear error manually
  const clearError = () => {
    setError(null);
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return null;
    return user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user.email;
  };

  // // Don't render children until auth state is initialized
  // if (!isInitialized) {
  //   return <div className="app-loading">Loading...</div>;
  // }

  return (
    <AuthContext.Provider
      value={{
        user, // use !!user to check if logged in
        setUser,
        loading,
        authLoading,
        error,
        isInitialized,
        isAuthenticated,
        login,
        signup,
        logout,
        clearError,

        // Helpers
        hasRole,
        getUserDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
//export const useAuth = () => useContext(AuthContext);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

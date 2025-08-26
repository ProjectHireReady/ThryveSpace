// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  signupUser,
  logoutUser /*, getCurrentUser */,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = guest
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper: save user & token after login/signup
  const handleAuthSuccess = (data) => {
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) setUser(data.user);
  };

  // Restore user after reload
  useEffect(() => {
    const restoreUser = async () => {
      setLoading(true);
      try {
        const data = await getCurrentUser(); // expects { user: {...}, token: ... } or just user
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreUser();
  }, []);

  // Login
  const login = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(payload);
      handleAuthSuccess(data);
      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const signup = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await signupUser(payload);
      handleAuthSuccess(data);
      return data;
    } catch (err) {
      setError(err.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutUser(); // optional backend call
    } catch {
      // ignore backend errors
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user, // use !!user to check if logged in
        loading,
        error,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);

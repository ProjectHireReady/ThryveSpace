// src/services/authService.js
import axiosInstance from "../lib/axiosInstance";

// Signup a new user
export const signupUser = async (payload) => {
  try {
    const { data } = await axiosInstance.post("/auth/signup", payload);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

// Log in an existing user
export const loginUser = async (payload) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", payload);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// Log out the current user
export const logoutUser = async () => {
  try {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Logout failed" };
  }
};

// Get the currently authenticated user, but comment for now until backend adds it
export const getCurrentUser = async () => {
  try {
    const { data } = await axiosInstance.get("/auth/me");
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch current user" };
  }
};


import axiosInstance from "../lib/axiosInstance";
import { getUser } from "../api/user";  // reuse user.js for fetching profile

// Minimal parseError to show DRF's exact message
const parseError = (error, fallback = "An error occurred") => {
  const errData = error.response?.data;
  if (!errData) return { message: fallback };

  if (errData.non_field_errors) return { message: errData.non_field_errors[0] };
  if (errData.detail) return { message: errData.detail };
  if (errData.message) return { message: errData.message };

  const firstKey = Object.keys(errData)[0];
  if (firstKey && Array.isArray(errData[firstKey])) {
    return { message: `${firstKey}: ${errData[firstKey][0]}` };
  }

  return { message: fallback };
};

// Signup a new user
export const signupUser = async (payload) => {
  console.log("SIGNUP PAYLOAD ===>", payload);
  try {
    const { data } = await axiosInstance.post("/auth/signup/", payload);
    return data;
  } catch (error) {
    console.error("SIGNUP ERROR ===>", error.response?.data);
    throw parseError(error, "Signup failed");
  }
};

// Log in an existing user
export const loginUser = async (payload) => {
  try {
    const { data } = await axiosInstance.post("/auth/login/", payload);
    return data;
  } catch (error) {
    throw parseError(error, "Login failed");
  }
};

// Log out the current user
export const logoutUser = async () => {
  try {
    const { data } = await axiosInstance.post("/auth/logout/");
    return data;
  } catch (error) {
    throw parseError(error, "Logout failed");
  }
};

// Get the currently authenticated user
export const getCurrentUser = async () => {
  try {
    // Just delegate to user.js
    return await getUser();
  } catch (error) {
    throw parseError(error, "Failed to fetch current user");
  }
};

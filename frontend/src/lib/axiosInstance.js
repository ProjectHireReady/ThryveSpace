// /lib/axiosInstance.js

import axios from "axios";

// Create axios instance with base URL from .env
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Runs before each request
// If token is in localStorage, add it to the headers for auth
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

export default axiosInstance;

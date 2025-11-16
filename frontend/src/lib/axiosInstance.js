// /lib/axiosInstance.js

import axios from "axios";

// ---- base URL normalization ----
function normalizeBase(url) {
  if (!url) return "/api/v1/";              // safe default for same-origin deploys (Vercel proxy)
  return url.endsWith("/") ? url : url + "/"; // ensures exactly one trailing slash
}

const baseURL = normalizeBase(import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000, // 15s is reasonable for preview backends
});

// Attach auth token if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

// Bubble up API error messages (nice for toasts)
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const apiMsg =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      "Request failed";
    err.message = apiMsg;
    return Promise.reject(err);
  }
);

// ---- TEMP: preview debug helper ----
if (typeof window !== "undefined") {
  window.__API_BASE__ = baseURL;
  // eslint-disable-next-line no-console
  console.log("[axios] baseURL =", baseURL);
}

export default axiosInstance;
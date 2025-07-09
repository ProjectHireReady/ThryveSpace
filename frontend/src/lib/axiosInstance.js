// /lib/axiosInstance.js

import axios from "axios"; // import axios library
import getCookie from "../utils/getCookie"; // helper function to read CSRF token from cookies

// Create an axios instance with custom settings
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // base URL of our backend (set in .env)
  withCredentials: true, // tells browser to include cookies like sessionid and csrftoken
});

// Attach CSRF token automatically before sending any write request (like POST, PATCH, DELETE)
axiosInstance.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrftoken"); // get the token from browser cookie

  // Check if the request method is one that can change data
  const isWrite = ["post", "patch", "put", "delete"].includes(
    config.method?.toLowerCase()
  );

  // If it's a write request and we have the token, attach it to the headers
  if (isWrite && csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  return config; // return the modified config
});

export default axiosInstance; // export so we can use it in our API files

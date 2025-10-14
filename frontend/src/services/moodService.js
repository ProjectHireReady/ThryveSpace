import axiosInstance from "../lib/axiosInstance";

// moodService handles fetching moods/categories from the backend
// Caches the latest data and ETag so we don’t keep hitting the API
// If nothing changed (304), just returns what we already have

let etag = null;
let cachedMoods = null;

export async function fetchMoods() {
  try {
    const response = await axiosInstance.get("/moods/", {
      headers: { "If-None-Match": etag || "" },
      validateStatus: (status) => status === 200 || status === 304,
    });

    if (response.status === 304) return cachedMoods; // return cached data

    // Store ETag exactly as received (including quotes)
    etag = response.headers["etag"] || null;
    cachedMoods = response.data;

    return cachedMoods;

  } catch (error) {
    console.error("Failed to fetch moods:", error);

    // Fallback to cached data if available
    if (cachedMoods) return cachedMoods;

    throw error;
  }
}

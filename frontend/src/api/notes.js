// /src/api/notes.js

import axios from "../lib/axiosInstance"; // Use the custom Axios setup with the baseURL

// Get all journal entries (GET /notes/)
export const getNotes = () => {
  return axios.get("/notes/");
};

// Create a new journal entry (POST /notes/)
export const postNote = (payload) => {
  return axios.post("/notes/", payload);
};

// Update a journal entry by ID (PATCH /notes/:id/)
export const updateNote = (id, payload) => {
  return axios.patch(`/notes/${id}/`, payload);
};

// Delete a journal entry by ID (DELETE /notes/:id/)
export const deleteNote = (id) => {
  return axios.delete(`/notes/${id}/`);
};

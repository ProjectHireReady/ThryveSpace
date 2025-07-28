// src/context/EntriesContext.js

// This file handles all entries/notes logic

import { createContext, useContext, useState, useEffect } from "react";
import { getNotes, postNote, updateNote, deleteNote } from "../api/notes";

// Create the context
const EntriesContext = createContext();

// Provider component
export const EntriesProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all entries (GET)
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await getNotes();
      setEntries(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load entries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new entry (POST)
  const addEntry = async (payload) => {
    try {
      const res = await postNote(payload);
      setEntries((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Error adding entry:", err);
      throw err;
    }
  };

  // Update an existing entry (PATCH)
  const updateEntry = async (id, payload) => {
    try {
      const res = await updateNote(id, payload);
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? res.data : entry))
      );
    } catch (err) {
      console.error("Error updating entry:", err);
      throw err;
    }
  };

  // Delete an entry (DELETE)
  const removeEntry = async (id) => {
    try {
      await deleteNote(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error("Error deleting entry:", err);
      throw err;
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <EntriesContext.Provider
      value={{
        entries,
        loading,
        error,
        fetchEntries,
        addEntry,
        updateEntry,
        removeEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

// Custom hook to use the context
export const useEntries = () => useContext(EntriesContext);

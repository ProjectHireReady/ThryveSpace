// src/context/EntriesContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getNotes, postNote, updateNote, deleteNote } from "../api/notes";
import {
  getOrCreateGuestId,
  createGuestEntry,
  clearAllGuestData,
} from "../utils/guestUtils";
import { useAuth } from "./AuthContext";

const EntriesContext = createContext();
export const useEntries = () => useContext(EntriesContext);

export const EntriesProvider = ({ children }) => {
  const [guestId, setGuestId] = useState(null);
  const { user, isInitialized } = useAuth();
  const isLoggedIn = !!user;

  // Entries state
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageKey = guestId ? `entries-${guestId}` : null;

  // Guest: create guestId only if needed (after auth is initialized)
  useEffect(() => {
    if (!isInitialized) return;
    if (!isLoggedIn && !guestId) {
      const newGuestId = getOrCreateGuestId(true);
      setGuestId(newGuestId);
    }
  }, [isInitialized, isLoggedIn, guestId]);

  // Guest: hydrate guest entries
  useEffect(() => {
    if (!isInitialized) return;

    if (!isLoggedIn && guestId && storageKey) {
      const saved = localStorage.getItem(storageKey);
      setEntries(saved ? JSON.parse(saved) : []);
      setLoading(false);
    } else if (!isLoggedIn) {
      setLoading(false);
    }
  }, [isInitialized, guestId, isLoggedIn, storageKey]);

  // Logged-in: fetch entries from backend once user is available
  useEffect(() => {
    if (!isInitialized) return;
    if (user) {
      fetchEntries().then(() => {
        // after fetching user notes, clear old guest data
        resetGuest();
      });
    }
  }, [user, isInitialized]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await getNotes();
      console.log("Fetched notes from backend:", res.data);
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save guest entries to localStorage
  const saveGuestEntries = (entriesToSave) => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(entriesToSave));
  };

  // Add entry
  const addEntry = async (payload) => {
    if (isLoggedIn) {
      const res = await postNote(payload);
      console.log("FULL response from backend in addEntry:", res.data); // or response.data
      setEntries((prev) => [res.data, ...prev]);
      return res.data;
    } else {
      const newEntry = createGuestEntry(payload);
      setEntries((prev) => {
        const updated = [newEntry, ...prev];
        saveGuestEntries(updated);
        return updated;
      });
    }
  };

  // Update entry
  const updateEntry = async (id, payload) => {
    if (isLoggedIn) {
      const res = await updateNote(id, payload);
      setEntries((prev) => prev.map((e) => (e.id === id ? res.data : e)));
    } else {
      setEntries((prev) => {
        const updated = prev.map((e) =>
          e.id === id
            ? { ...e, ...payload, updated_at: new Date().toISOString() }
            : e
        );
        saveGuestEntries(updated);
        return updated;
      });
    }
  };

  // Remove entry
  const removeEntry = async (id) => {
    if (isLoggedIn) {
      await deleteNote(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } else {
      setEntries((prev) => {
        const updated = prev.filter((e) => e.id !== id);
        saveGuestEntries(updated);
        return updated;
      });
    }
  };

  // Clear all entries
  const clearEntries = () => {
    if (storageKey) localStorage.removeItem(storageKey);
    setEntries([]);
  };

  // Reset guest (after migration/decline)
  const resetGuest = () => {
    clearAllGuestData();
    if (!isLoggedIn) {
      const newId = getOrCreateGuestId(true);
      setGuestId(newId);
      setEntries([]);
    } else {
      setGuestId(null); // logged-in users keep backend entries
    }
  };

  return (
    <EntriesContext.Provider
      value={{
        entries,
        loading,
        fetchEntries,
        addEntry,
        updateEntry,
        removeEntry,
        clearEntries,
        resetGuest,
        guestId,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};

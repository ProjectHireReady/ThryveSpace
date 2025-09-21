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
  const { user, loading: authLoading } = useAuth();
  const isLoggedIn = !!user;

  // create guestId only if needed
  useEffect(() => {
    if (authLoading) return; // wait until AuthContext finishes restoring
    if (!isLoggedIn && !guestId) {
      const newGuestId = getOrCreateGuestId(true);
      setGuestId(newGuestId);
    }
  }, [authLoading, isLoggedIn, guestId]);

  //  Entries state
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageKey = guestId ? `entries-${guestId}` : null;

  // Hydrate guest entries on mount
  useEffect(() => {
    if (!isLoggedIn && guestId && storageKey) {
      const saved = localStorage.getItem(storageKey);
      setEntries(saved ? JSON.parse(saved) : []);
      setLoading(false);
    } else if (!isLoggedIn) {
      setLoading(false);
    }
  }, [guestId, isLoggedIn, storageKey]);

  // Fetch entries for logged-in users
  useEffect(() => {
    if (isLoggedIn) fetchEntries();
  }, [isLoggedIn]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await getNotes();
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save guest entries to localStorage only
  const saveGuestEntries = (entriesToSave) => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(entriesToSave));
  };

  // Add entry
  const addEntry = async (payload) => {
    if (isLoggedIn) {
      const res = await postNote(payload);
      setEntries((prev) => [res.data, ...prev]);
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

  //  Clear all entries
  const clearEntries = () => {
    if (storageKey) localStorage.removeItem(storageKey);
    setEntries([]);
  };

  // Reset guest (after migration/decline)
  const resetGuest = () => {
    clearAllGuestData();
    if (!isLoggedIn) {
      // only recreate guestId if the user is still a guest
      const newId = getOrCreateGuestId(true);
      setGuestId(newId);
    } else {
      // logged-in users: guestId should vanish
      setGuestId(null);
    }
    setEntries([]);
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

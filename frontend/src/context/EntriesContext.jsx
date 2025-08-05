import React, { createContext, useContext, useEffect, useState } from "react";
import { getNotes, postNote, updateNote, deleteNote } from "../api/notes";
import {
  getOrCreateGuestId,
  clearGuestId,
  createGuestEntry,
} from "../utils/guestUtils";
import { useAuth } from "./AuthContext";

const EntriesContext = createContext();
export const useEntries = () => useContext(EntriesContext);

export const EntriesProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();

  const [guestId, setGuestId] = useState(() => getOrCreateGuestId());
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const storageKey = `entries-${guestId}`;

  useEffect(() => {
    fetchEntries();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      const saved = localStorage.getItem(storageKey);
      setEntries(saved ? JSON.parse(saved) : []);
    }
  }, [guestId]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const res = await getNotes();
        setEntries(res.data);
      } else {
        const saved = localStorage.getItem(storageKey);
        setEntries(saved ? JSON.parse(saved) : []);
      }
    } catch (err) {
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveGuestEntries = (newEntries) => {
    localStorage.setItem(storageKey, JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const addEntry = async (payload) => {
    if (isLoggedIn) {
      const res = await postNote(payload);
      setEntries((prev) => [res.data, ...prev]);
    } else {
      const newEntry = createGuestEntry(payload); // Use helper
      const updated = [newEntry, ...entries];
      saveGuestEntries(updated);
    }
  };

  const updateEntry = async (id, payload) => {
    if (isLoggedIn) {
      const res = await updateNote(id, payload);
      setEntries((prev) => prev.map((e) => (e.id === id ? res.data : e)));
    } else {
      const updated = entries.map((e) =>
        e.id === id ? { ...e, ...payload } : e
      );
      saveGuestEntries(updated);
    }
  };

  const removeEntry = async (id) => {
    if (isLoggedIn) {
      await deleteNote(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } else {
      const updated = entries.filter((e) => e.id !== id);
      saveGuestEntries(updated);
    }
  };

  const clearEntries = () => {
    localStorage.removeItem(storageKey);
    setEntries([]);
  };

  const resetGuest = () => {
    clearEntries();
    clearGuestId();
    const newId = getOrCreateGuestId();
    setGuestId(newId);
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
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getNotes, postNote, updateNote as apiUpdateNote, deleteNote as apiDeleteNote } from "../api/v1/notes";
import { getOrCreateGuestId, clearGuestId, createGuestEntry } from "../utils/guestUtils";
import { useAuth } from "./AuthContext";

const EntriesContext = createContext();
export const useEntries = () => useContext(EntriesContext);

export const EntriesProvider = ({ children }) => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [guestId, setGuestId] = useState(() => getOrCreateGuestId());
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storageKey = `entries-${guestId}`;

  // Core fetch with options { force }
  const fetchEntries = useCallback(
    async ({ force } = {}) => {
      setLoading(true);
      setError(null);
      try {
        if (isLoggedIn) {
          // Server source of truth
          const res = await getNotes();
          setEntries(Array.isArray(res?.data) ? res.data : []);
        } else {
          // Guest: localStorage
          const saved = localStorage.getItem(storageKey);
          setEntries(saved ? JSON.parse(saved) : []);
        }
      } catch (err) {
        console.error("Error fetching entries:", err);
        setError(err?.message || "Failed to load entries");
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, storageKey]
  );

  // Thin alias for clarity in callers
  const refreshEntries = useCallback(
    async ({ force } = {}) => fetchEntries({ force }),
    [fetchEntries]
  );

  // On auth change, force refresh from the right source
  useEffect(() => {
    fetchEntries({ force: true });
  }, [isLoggedIn, fetchEntries]);

  // When guestId changes (new guest session), load local entries
  useEffect(() => {
    if (!isLoggedIn) {
      const saved = localStorage.getItem(storageKey);
      setEntries(saved ? JSON.parse(saved) : []);
    }
  }, [guestId, isLoggedIn, storageKey]);

  const saveGuestEntries = (newEntries) => {
    localStorage.setItem(storageKey, JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const addEntry = async (payload) => {
    if (isLoggedIn) {
      // Optimistic prepend; server returns created object
      const res = await postNote(payload);
      setEntries((prev) => [res.data, ...prev]);
      // If you prefer server ordering/derived fields, you can instead:
      // await refreshEntries({ force: true });
    } else {
      const newEntry = createGuestEntry(payload);
      const updated = [newEntry, ...entries];
      saveGuestEntries(updated);
    }
  };

  const updateEntry = async (id, payload) => {
    if (isLoggedIn) {
      const res = await apiUpdateNote(id, payload);
      setEntries((prev) => prev.map((e) => (e.id === id ? res.data : e)));
      // Or refetch for server-calculated fields:
      // await refreshEntries({ force: true });
    } else {
      const updated = entries.map((e) =>
        e.id === id
          ? { ...e, ...payload, updated_at: new Date().toISOString() }
          : e
      );
      saveGuestEntries(updated);
    }
  };

  const removeEntry = async (id) => {
    if (isLoggedIn) {
      await apiDeleteNote(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      // Or: await refreshEntries({ force: true });
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
        error,               // exposed
        fetchEntries,        // accepts { force }
        refreshEntries,      // convenience alias
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

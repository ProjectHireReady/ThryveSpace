// utils/guestUtils.js
import { v4 as uuidv4 } from "uuid";

// Get guest ID, or create a new one if allowed
export const getOrCreateGuestId = (createIfMissing = true) => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId && createIfMissing) {
    guestId = uuidv4();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

// Remove guest ID
export const clearGuestId = () => localStorage.removeItem("guestId");

// Create a new guest entry
export const createGuestEntry = (payload) => ({
  id: uuidv4(),
  note: payload.note,
  name: payload.name || "",
  icon: payload.icon || "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Format guest entry for backend
export const formatGuestPayload = (note, mood, title) => ({
  title: title || "",
  note: note || "",
  name: mood?.name || "",
  icon: mood?.icon || "",
});

// Check if any guest entries exist
export const hasGuestEntries = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("entries-")) {
      try {
        const entries = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(entries) && entries.length) return true;
      } catch {}
    }
  }
  return false;
};

// Clear all guest data (entries, flags, ID)
export const clearAllGuestData = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("entries-")) localStorage.removeItem(key);
  }
  localStorage.removeItem("lastKindnessShown");
  localStorage.removeItem("loginPromptShown");
  clearGuestId();
};
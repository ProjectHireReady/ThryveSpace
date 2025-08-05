import { v4 as uuidv4 } from "uuid";

// Either grab the guest ID from localStorage or create a new one if none exists
export const getOrCreateGuestId = () => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

// Clears the guest ID, which is useful if we want to enable a guest reset
export const clearGuestId = () => {
  localStorage.removeItem("guestId");
};

// Creates a new guest entry, adding ID and timestamps for consistency
export const createGuestEntry = (payload) => ({
  id: uuidv4(),
  note: payload.note,
  name: payload.name || "",
  emoji: payload.emoji || "",
  category: payload.category || "",
  imageUrl: payload.imageUrl || "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Takes a note and mood object, then picks only the parts we need
// This helps keep data consistent whether moods come from backend or local
export const formatGuestPayload = (note, mood) => ({
  note,
  name: mood?.name || "",
  emoji: mood?.emoji || "",
  category: mood?.category || "",
  imageUrl: mood?.image_url || "", // backend sometimes uses snake_case
});
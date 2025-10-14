// src/context/MoodContext.js

// Provides moods and categories to the app; loads once and stores globally

import { createContext, useContext, useState, useEffect } from "react";
import { fetchMoods } from "../services/moodService";

const MoodContext = createContext();

export function MoodProvider({ children }) {
  const [moods, setMoods] = useState({});
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMoods = async () => {
      try {
        const data = await fetchMoods();
        if (!data) return; 

        // Map moods by id for easy lookup
        const moodMap = {};
        (data.moods || []).forEach((m) => (moodMap[m.id] = m));

        // Map categories by value for easy lookup
        const categoryMap = {};
        (data.categories || []).forEach((c) => (categoryMap[c.value] = c));

        setMoods(moodMap);
        setCategories(categoryMap);
      } catch (err) {
        console.error("Failed to load moods:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMoods();
  }, []);

  return (
    <MoodContext.Provider value={{ moods, categories, loading }}>
      {children}
    </MoodContext.Provider>
  );
}

// Hook for easy access
export function useMoods() {
  return useContext(MoodContext);
}

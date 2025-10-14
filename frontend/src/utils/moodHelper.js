// src/helpers/moodHelpers.js
// Provides easy functions to get moods or categories from the global state

import { useMoods } from "../context/MoodContext";

export function useMoodHelpers() {
  const { moods, categories } = useMoods();

  // Get a single mood by ID
  const getMood = (id) => moods[id] || null;

  // Get all moods as an array (for MoodSelector or other components)
  const getAllMoods = () => Object.values(moods);

  // Get a single category by value
  const getCategory = (value) => categories[value] || null;

  // Get all categories as an array (for graphs, grouping, etc.)
  const getAllCategories = () => Object.values(categories);

  return { getMood, getAllMoods, getCategory, getAllCategories };
}

// config.js
export const USE_AI_KINDNESS = import.meta.env.VITE_USE_AI_KINDNESS === "true";

// Minimum number of entries before showing kindness (rule-based)
export const MIN_ENTRIES_BEFORE_KINDNESS = Number(import.meta.env.VITE_MIN_ENTRIES_BEFORE_KINDNESS) || 3;

// Note endpoints
export const API_ENDPOINTS = {
  kindnessAI: import.meta.env.VITE_KINDNESS_AI_ENDPOINT || "/insights/ai-feedback/",
  kindnessRule: import.meta.env.VITE_KINDNESS_RULE_ENDPOINT || "/messages/kindness/",
};

// Insights endpoints
export const USE_AI_INSIGHTS = import.meta.env.VITE_USE_AI_INSIGHTS === "true";
export const API_ENDPOINTS_INSIGHTS = {
  aiMessages: import.meta.env.VITE_INSIGHTS_AI_ENDPOINT || "/insights/ai-messages/",
  ruleTip: import.meta.env.VITE_INSIGHTS_RULE_ENDPOINT || "/insights/tip/",
};
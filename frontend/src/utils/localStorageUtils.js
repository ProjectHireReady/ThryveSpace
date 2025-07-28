export function getToday() {
  return new Date().toDateString();
}

// KINDNESS MESSAGE
export function shouldShowKindness() {
  const lastShown = localStorage.getItem("lastKindnessShown");
  return lastShown !== getToday();
}

export function markKindnessShown() {
  localStorage.setItem("lastKindnessShown", getToday());
}

// LOGIN PROMPT
export function shouldShowLoginPrompt() {
  const lastLoginPrompt = localStorage.getItem("loginPromptShown");
  return lastLoginPrompt !== getToday();
}

export function markLoginPromptShown() {
  localStorage.setItem("loginPromptShown", getToday());
}

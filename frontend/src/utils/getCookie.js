// Utility to get the value of a specific cookie by name
// Used for session authentication (e.g., CSRF tokens or session ID)
export default function getCookie(name) {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieValue ? decodeURIComponent(cookieValue.split("=")[1]) : null;
}

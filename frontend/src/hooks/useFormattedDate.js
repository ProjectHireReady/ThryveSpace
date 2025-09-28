// Simple hook to format the current date (e.g., "20 SEP")
export default function useFormattedDate() {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" }).toUpperCase();

  return { day, month };
}

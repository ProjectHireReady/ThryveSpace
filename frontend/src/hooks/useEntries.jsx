import { useEffect, useState } from "react";
import axios from "axios";

/**
 * Custom hook to get all journal entries from the backend.
 * Also tracks loading and error states.
 */
export function useEntries() {
  // List of journal entries from the server
  const [entries, setEntries] = useState([]);
  // True while data is loading
  const [loading, setLoading] = useState(true);
  // Holds an error message if something goes wrong
  const [error, setError] = useState(null);

  // Function to fetch entries from the API
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/v1/notes/");
      setEntries(res.data); // Save entries to state
      setError(null); // Clear any error
    } catch (err) {
      setError("Could not load entries. Try again.");
    } finally {
      setLoading(false); // Stop loading (success or fail)
    }
  };

  // Fetch entries once when the page first loads
  useEffect(() => {
    fetchEntries();
  }, []);

  // Return everything needed to use in a component
  return { entries, loading, error, refresh: fetchEntries };
}

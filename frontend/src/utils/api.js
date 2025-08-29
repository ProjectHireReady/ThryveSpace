export async function migrateGuestEntries(guestEntries, token) {
  try {
    const response = await fetch("/api/migrate/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify({ entries: guestEntries })
    });
    return await response.json();
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  }
}

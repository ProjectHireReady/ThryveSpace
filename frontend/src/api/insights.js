// src/api/insights.js
export async function getInsights(weekOffset = 0) {
  try {
    const res = await fetch(`/api/v1/insights/tip?week_offset=${weekOffset}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // in case you need cookies/session
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return { data }; // shape stays consistent
  } catch (err) {
    console.warn("Falling back to mock insights:", err.message);

    // Mock fallback
    const mockInsights = [
      { type: "info", message: "Keeping a daily journal helps you reflect better." },
      { type: "success", message: "Great job! You’ve been consistent this week 🎉" },
      { type: "warning", message: "Try balancing your moods with some self-care." },
      { type: "error", message: "You seem stressed — consider reaching out to a friend." },
    ];

    const random = mockInsights[Math.floor(Math.random() * mockInsights.length)];
    return { data: random };
  }
}

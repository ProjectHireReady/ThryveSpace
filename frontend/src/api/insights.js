export async function getInsights() {
    // Fake delay (like a real network request)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock insights (you can tweak these)
    const mockInsights = [
        { type: "info", message: "Keeping a daily journal helps you reflect better." },
        { type: "success", message: "Great job! You’ve been consistent this week 🎉" },
        { type: "warning", message: "Try balancing your moods with some self-care." },
        { type: "error", message: "You seem stressed — consider reaching out to a friend." },
    ];

    // Pick one at random
    const random = mockInsights[Math.floor(Math.random() * mockInsights.length)];

    return { data: random }; // Matches what your EntriesPage expects
}

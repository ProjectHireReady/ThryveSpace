import axios from "../lib/axiosInstance";

export async function getUser() {
    try {
        const res = await axios.get("/auth/me/");
        return res.data;
    } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
        throw err;
    }
}

// Update logged-in user
export async function updateUser(updates) {
    try {
        const res = await axios.put("/auth/me/", updates);
        return res.data;
    } catch (err) {
        console.error("Failed to update user:", err.response?.data || err.message);
        throw err;
    }
}

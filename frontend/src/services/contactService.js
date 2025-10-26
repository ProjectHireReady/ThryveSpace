// src/services/contactService.js
import axiosInstance from "../lib/axiosInstance";

/**
 * Send contact message to backend
 * @param {{ name:string, email:string, message:string }} payload
 * @returns {Promise<{ ok?: boolean, message?: string }>}
 */
export async function sendContact(payload) {
  try {
    const { data } = await axiosInstance.post("/api/contact", payload);
    return data ?? { ok: true };
  } catch (err) {
    const status = err?.response?.status;
    const apiMessage = err?.response?.data?.message || err?.message;
    const message =
      status >= 500
        ? "Server error. Please try again."
        : apiMessage || "Something went wrong";
    throw Object.assign(new Error(message), { status });
  }
}

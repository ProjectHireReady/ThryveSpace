// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import "./ProfilePage.css";
import { useAuth } from "../context/AuthContext";
import { getUser, updateUser } from "../api/user";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "********",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Load user from backend
  useEffect(() => {
    async function fetchUser() {
      try {
        const { user: data } = await getUser();
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          password: "********",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
      };
      const updated = await updateUser(updates);
      setUser(updated);
      setFormData({
        firstName: updated.first_name,
        lastName: updated.last_name,
        email: updated.email,
        password: "********",
      });
    } catch (err) {
      console.error("Error saving:", err.response?.data || err.message);
      setError("Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValue(formData[field]);
  };

  const handleSaveEdit = async () => {
    try {
      const newFormData = {
        ...formData,
        [editingField]: editValue,
      };
      setFormData(newFormData);

      const updates = {
        first_name: newFormData.firstName,
        last_name: newFormData.lastName,
        email: newFormData.email,
      };

      if (editingField === "password" && editValue.trim() !== "********") {
        updates.password = editValue;
      }

      const updated = await updateUser(updates);
      setUser(updated);
      setFormData({
        firstName: updated.first_name,
        lastName: updated.last_name,
        email: updated.email,
        password: "********",
      });

      setEditingField(null);
      setEditValue("");
    } catch (err) {
      console.error("Error saving edit:", err.response?.data || err.message);
      setError("Could not save changes.");
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  if (loading) return <div className="profile-loader">Loading profile...</div>;

  const formatFieldName = (field) =>
    field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  // Avatar fallback (first letter of first name)
  const firstLetter = formData.firstName?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="profile-page">
      <div className="profile-card">
        {user?.avatar ? (
          <img src={user.avatar} alt="Profile" className="profile-avatar" />
        ) : (
          <div className="profile-fallback-avatar">{firstLetter}</div>
        )}
        <div className="profile-names">
          <span className="profile-first-name">{formData.firstName}</span>
          <span className="profile-last-name">{formData.lastName}</span>
        </div>
      </div>

      {error && <p className="profile-error">{error}</p>}

      <div className="profile-rows">
        <div className="profile-row">
          <div className="profile-info">
            <span className="profile-label">First Name</span>
            <span className="profile-value">{formData.firstName}</span>
          </div>
          <button className="edit-btn" onClick={() => handleEdit("firstName")}>
            Edit
          </button>
        </div>

        <div className="profile-row">
          <div className="profile-info">
            <span className="profile-label">Last Name</span>
            <span className="profile-value">{formData.lastName}</span>
          </div>
          <button className="edit-btn" onClick={() => handleEdit("lastName")}>
            Edit
          </button>
        </div>

        <div className="profile-row">
          <div className="profile-info">
            <span className="profile-label">Email</span>
            <span className="profile-value">{formData.email}</span>
          </div>
          <button className="edit-btn" onClick={() => handleEdit("email")}>
            Edit
          </button>
        </div>

        <div className="profile-row">
          <div className="profile-info">
            <span className="profile-label">Password</span>
            <span className="profile-value">{formData.password}</span>
          </div>
          <span
            className="profile-link"
            onClick={() => navigate("/forgot_password")}
          >
            Change
          </span>
        </div>
      </div>

      <button
        className="profile-save-btn"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      {editingField && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Edit your {formatFieldName(editingField)}</h2>
              <button className="modal-close" onClick={handleCancelEdit}>
                ×
              </button>
            </div>

            <div className="modal-input-wrapper">
              <input
                type={editingField === "password" ? "password" : "text"}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="modal-input"
                placeholder={formatFieldName(editingField)}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSaveEdit}>
                Save Changes
              </button>
              <button className="btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

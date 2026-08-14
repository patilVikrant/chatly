import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Settings.css";

const Settings = () => {
  const { user, setUser, setToken } = useAuth();

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const handleProfileChange = (e) => {
    setProfileData((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileLoading(true);
    try {
      const res = await api.put("/auth/update-profile", profileData);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setProfileMsg("Profile updated successfully");
    } catch (err) {
      setProfileMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordLoading(true);
    try {
      await api.put("/auth/change-password", passwordData);
      setPasswordMsg("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeleteLoading(true);
    try {
      await api.delete("/auth/delete-account");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Chat
        </button>
        <h1 className="settings-title">Settings</h1>
        <div className="settings-card">
          <h2>Update Profile</h2>
          <form onSubmit={handleProfileSubmit} className="settings-form">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              required
            />
            {profileMsg && <p className="settings-msg">{profileMsg}</p>}
            <button type="submit" disabled={profileLoading}>
              {profileLoading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
        <div className="settings-card">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="settings-form">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            {passwordMsg && <p className="settings-msg">{passwordMsg}</p>}
            <button type="submit" disabled={passwordLoading}>
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
        <div className="settings-card danger-zone">
          <h2>Delete Account</h2>
          <p>
            Once you delete your account, all your messages will be permanently
            removed and you will be logged out.
          </p>
          <button
            className="delete-btn"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

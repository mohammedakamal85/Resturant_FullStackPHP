import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          address: response.data.address || "",
          phone: response.data.phone || "",
        });
      } catch (error) {
        console.error("There was an error!", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        "http://127.0.0.1:8000/api/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(response.data.user);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete("http://127.0.0.1:8000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleLogout();
    } catch (error) {
      console.error("Error deleting profile:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setProfile(null);
    setEditing(false);
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile__container">
      <Header />
      <h1>Profile</h1>
      {profile ? (
        editing ? (
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </label>
            <button type="submit" className="form__button">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="form__button">
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile__card">
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Address:</strong> {profile.address || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone || "N/A"}
            </p>
            <button onClick={() => setEditing(true)}>Update</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )
      ) : (
        <p>No profile found.</p>
      )}
    </div>
  );
};

export default Profile;

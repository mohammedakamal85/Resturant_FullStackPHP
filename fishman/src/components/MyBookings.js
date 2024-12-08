import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No auth token found. Please log in again.");
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/my-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        setError(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (error) {
      setError(error.response?.data || error.message);
    }
  };

  const handleUpdate = (booking) => {
    setEditingBooking(booking.id);
    setFormData({
      username: booking.username,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
    });
  };

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
        `http://127.0.0.1:8000/api/bookings/${editingBooking}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(
        bookings.map((booking) =>
          booking.id === editingBooking ? response.data.booking : booking
        )
      );
      setEditingBooking(null);
    } catch (error) {
      setError(error.response?.data || error.message);
    }
  };

  return (
    <div className="my__bookings">
      <Header />
      <h1>My Bookings</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {Array.isArray(bookings) && bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking.id} className="user__booking">
            {editingBooking === booking.id ? (
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
                  Phone:
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Time:
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Guests:
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                  />
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingBooking(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p>
                  UserName: <span>{booking.username}</span>
                </p>
                <p>
                  Email: <span>{booking.email}</span>
                </p>
                <p>
                  Phone: <span>{booking.phone}</span>
                </p>
                <p>
                  Guests: <span>{booking.guests}</span>
                </p>
                <p>
                  Date: <span>{booking.date}</span>
                </p>
                <p>
                  Time: <span>{booking.time}</span>
                </p>
                <button onClick={() => handleUpdate(booking)}>Update</button>
                <button onClick={() => handleDelete(booking.id)}>Delete</button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default MyBookings;

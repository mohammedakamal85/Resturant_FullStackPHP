import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [editingUser, setEditingUser] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    role: "user",
  });
  const [bookingFormData, setBookingFormData] = useState({
    username: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const profileResponse = await axios.get(
          "http://127.0.0.1:8000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (profileResponse.data.role !== "admin") {
          throw new Error("You are not authorized to view this page.");
        }

        const [usersResponse, bookingsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://127.0.0.1:8000/api/bookings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setUsers(usersResponse.data);
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("There was an error!", error);
        setError(error.message);

        if (error.message === "You are not authorized to view this page.") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: value,
    });
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData({
      ...bookingFormData,
      [name]: value,
    });
  };

  const handleUserUpdate = (user) => {
    setEditingUser(user.id);
    setUserFormData({
      username: user.username,
      email: user.email,
      address: user.address || "",
      phone: user.phone || "",
      role: user.role,
    });
  };

  const handleBookingUpdate = (booking) => {
    setEditingBooking(booking.id);
    setBookingFormData({
      username: booking.username,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/${editingUser}`,
        userFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(
        users.map((user) =>
          user.id === editingUser ? response.data.user : user
        )
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting booking data:", bookingFormData);

      const time = new Date(`1970-01-01T${bookingFormData.time}Z`);
      const timeIn24HourFormat = time.toISOString().substr(11, 5);

      const updatedBookingData = {
        ...bookingFormData,
        time: timeIn24HourFormat,
      };

      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `http://127.0.0.1:8000/api/bookings/${editingBooking}`,
        updatedBookingData,
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
      console.error("Error updating booking:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleUserDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleBookingDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin__panel">
      <Header />
      <h1>Admin Panel</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab("users")}>Users</button>
        <button onClick={() => setActiveTab("bookings")}>Bookings</button>
      </div>
      <div className="tab-content">
        {activeTab === "users" && (
          <div className="content__details">
            <h2>Users</h2>
            {users.length > 0 ? (
              <div className="cards">
                {users.map((user) => (
                  <div className="card" key={user.id}>
                    {editingUser === user.id ? (
                      <form onSubmit={handleUserSubmit}>
                        <label>
                          Username:
                          <input
                            type="text"
                            name="username"
                            value={userFormData.username}
                            onChange={handleUserChange}
                            required
                          />
                        </label>
                        <label>
                          Email:
                          <input
                            type="email"
                            name="email"
                            value={userFormData.email}
                            onChange={handleUserChange}
                            required
                          />
                        </label>
                        <label>
                          Address:
                          <input
                            type="text"
                            name="address"
                            value={userFormData.address}
                            onChange={handleUserChange}
                          />
                        </label>
                        <label>
                          Phone:
                          <input
                            type="text"
                            name="phone"
                            value={userFormData.phone}
                            onChange={handleUserChange}
                          />
                        </label>
                        <label>
                          Role:
                          <select
                            name="role"
                            value={userFormData.role}
                            onChange={handleUserChange}
                            required
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </label>
                        <button type="submit">Save</button>
                        <button
                          type="button"
                          onClick={() => setEditingUser(null)}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <h3>
                          Name: <span>{user.username}</span>
                        </h3>
                        <p>
                          Email: <span>{user.email}</span>
                        </p>
                        <p>
                          Address: <span>{user.address || "N/A"}</span>
                        </p>
                        <p>
                          Phone: <span>{user.phone || "N/A"}</span>
                        </p>
                        <p>
                          Role: <span>{user.role}</span>
                        </p>
                        <button onClick={() => handleUserUpdate(user)}>
                          Update
                        </button>
                        <button onClick={() => handleUserDelete(user.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No users available.</p>
            )}
          </div>
        )}
        {activeTab === "bookings" && (
          <div className="content__details">
            <h2>Bookings</h2>
            {bookings.length > 0 ? (
              <div className="cards">
                {bookings.map((booking) => (
                  <div className="card" key={booking.id}>
                    {editingBooking === booking.id ? (
                      <form onSubmit={handleBookingSubmit}>
                        <label>
                          Username:
                          <input
                            type="text"
                            name="username"
                            value={bookingFormData.username}
                            onChange={handleBookingChange}
                            required
                          />
                        </label>
                        <label>
                          Email:
                          <input
                            type="email"
                            name="email"
                            value={bookingFormData.email}
                            onChange={handleBookingChange}
                            required
                          />
                        </label>
                        <label>
                          Phone:
                          <input
                            type="text"
                            name="phone"
                            value={bookingFormData.phone}
                            onChange={handleBookingChange}
                            required
                          />
                        </label>
                        <label>
                          Date:
                          <input
                            type="date"
                            name="date"
                            value={bookingFormData.date}
                            onChange={handleBookingChange}
                            required
                          />
                        </label>
                        <label>
                          Time:
                          <input
                            type="text"
                            name="time"
                            value={bookingFormData.time}
                            onChange={handleBookingChange}
                            required
                            placeholder="hh:mm AM/PM"
                          />
                        </label>
                        <label>
                          Guests:
                          <input
                            type="number"
                            name="guests"
                            value={bookingFormData.guests}
                            onChange={handleBookingChange}
                            required
                          />
                        </label>
                        <button type="submit">Save</button>
                        <button
                          type="button"
                          onClick={() => setEditingBooking(null)}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <h3>
                          Name: <span>{booking.username}</span>
                        </h3>
                        <p>
                          Email: <span>{booking.email}</span>
                        </p>
                        <p>
                          Phone: <span>{booking.phone}</span>
                        </p>
                        <p>
                          Date: <span>{booking.date}</span>
                        </p>
                        <p>
                          Time: <span>{booking.time}</span>
                        </p>
                        <p>
                          Guests: <span>{booking.guests}</span>
                        </p>
                        <button onClick={() => handleBookingUpdate(booking)}>
                          Update
                        </button>
                        <button onClick={() => handleBookingDelete(booking.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No bookings available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

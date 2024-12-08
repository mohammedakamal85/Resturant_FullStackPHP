import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const BookTable = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 1,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.time) newErrors.time = "Time is required.";
    if (formData.guests < 1) newErrors.guests = "Guests must be at least 1.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    if (authToken) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/book-table",
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response.data);
        navigate("/my-bookings");
      } catch (error) {
        setErrors({ server: "An error occurred while booking the table." });
        console.error(
          "There was an error!",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    } else {
      setErrors({ server: "No auth token found. Please log in again." });
      setLoading(false);
    }
  };

  return (
    <div className="book__table__container">
      <Header />
      <form className="book__table" onSubmit={handleSubmit}>
        <h1>Book a Table</h1>
        {errors.server && (
          <p className="error" role="alert">
            {errors.server}
          </p>
        )}
        <input
        id="booking"
          type="text"
          name="username"
          placeholder="Your Name"
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
          aria-invalid={!!errors.username}
          aria-describedby="username-error"
        />
        {errors.username && (
          <p id="username-error" className="error">
            {errors.username}
          </p>
        )}
        <input
        id="booking"
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
        />
        {errors.email && (
          <p id="email-error" className="error">
            {errors.email}
          </p>
        )}
        <input
        id="booking"
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          disabled={loading}
          aria-invalid={!!errors.phone}
          aria-describedby="phone-error"
        />
        {errors.phone && (
          <p id="phone-error" className="error">
            {errors.phone}
          </p>
        )}
        <input
        id="booking"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          disabled={loading}
          aria-invalid={!!errors.date}
          aria-describedby="date-error"
        />
        {errors.date && (
          <p id="date-error" className="error">
            {errors.date}
          </p>
        )}
        <input
        id="booking"
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          disabled={loading}
          aria-invalid={!!errors.time}
          aria-describedby="time-error"
        />
        {errors.time && (
          <p id="time-error" className="error">
            {errors.time}
          </p>
        )}
        <input
        id="booking"
          type="number"
          name="guests"
          placeholder="Number of Guests"
          value={formData.guests}
          onChange={handleChange}
          disabled={loading}
          aria-invalid={!!errors.guests}
          aria-describedby="guests-error"
        />
        {errors.guests && (
          <p id="guests-error" className="error">
            {errors.guests}
          </p>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Table"}
        </button>
      </form>
    </div>
  );
};

export default BookTable;

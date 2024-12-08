import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        formData
      );

      const { access_token: token } = response.data;
      if (token) {
        const userResponse = await axios.get(
          "http://127.0.0.1:8000/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(userResponse.data));
        navigate("/");
      }
    } catch (error) {
      console.error(
        "There was an error!",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login__container">
    <form className="login" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        type="email"
        name="email"
        id="login"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        id="login"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
      <button type="submit" disabled={loading}>
        {loading ? "Logging..." : "Login"}
      </button>
    </form>
    </div>
  );
}

export default Login;

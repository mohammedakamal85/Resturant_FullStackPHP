import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import AboutUs from "./components/AboutUs";
import OurMenu from "./components/OurMenu";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import AdminPanel from "./components/AdminPanel";
import Booking from "./components/Booking";
import AddItem from "./components/AddItem";
import MyBookings from "./components/MyBookings";

const App = () => {
  const socket = new WebSocket("ws://127.0.0.1:8000/ws");

  socket.onopen = () => {
    console.log("Connected to server");
    socket.send("Hello from client");
  };

  socket.onmessage = (event) => {
    console.log(`Received: ${event.data}`);
  };

  socket.onclose = () => {
    console.log("Disconnected from server");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/menu" element={<OurMenu />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/add_item" element={<AddItem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;

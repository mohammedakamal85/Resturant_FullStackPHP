import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav>
      <div className="logo">
        <Link to="/">Fishman</Link>
      </div>
      <div className={`right__nav ${isMobileMenuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/about-us">About Us</Link>
          </li>

          {isLoggedIn ? (
            <>
              <li>
                <Link to="/menu">Menu</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/booking">Book a Table</Link>
              </li>
              <li>
                <Link to="/my-bookings">My Bookings</Link>
              </li>
              {user?.role === "admin" && (
                <>
                  <li>
                    <Link to="/add_item">Add Menu Item</Link>
                  </li>
                  <li>
                    <Link to="/admin-panel">Admin Panel</Link>
                  </li>
                </>
              )}
              <li>
                <button className="logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="mobile__toggle" onClick={toggleMobileMenu}>
        <span className="toggle__bar"></span>
        <span className="toggle__bar"></span>
        <span className="toggle__bar"></span>
      </div>
    </nav>
  );
};

export default Header;

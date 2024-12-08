import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer-content">
          <h3>Contact Us</h3>
          <p>Address: 123 Main Street, Giza, Egypt</p>
          <p>Phone: 123-456-7890</p>
          <p>Email: info@fishman.com</p>
          <p>&copy; 2021 Your Website. All Rights Reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;

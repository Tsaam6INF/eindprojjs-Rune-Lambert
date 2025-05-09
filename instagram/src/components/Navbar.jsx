// Navbar.jsx
import React from "react";
import "../styles/Navbar.css"; // Zorg ervoor dat je de juiste CSS hebt

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src="/path-to-your-logo.png" alt="Logo" className="logo" />
      </div>
      <div className="navbar-center">
        <input type="text" placeholder="Search" className="search-bar" />
      </div>
      <div className="navbar-right">
        <img
          src="/path-to-your-user-icon.png"
          alt="User"
          className="user-icon"
        />
      </div>
    </div>
  );
};

export default Navbar;

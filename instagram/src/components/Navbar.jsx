import React from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">Instagram</h1>
      <input type="text" placeholder="Zoeken..." className="search" />
      <div className="icons">
        <span>🏠</span>
        <span>💬</span>
        <span>❤️</span>
        <span>👤</span>
      </div>
    </nav>
  );
};

export default Navbar;

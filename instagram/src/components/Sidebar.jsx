import React from "react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Instagram</h2>
      <ul>
        <li>🏠 Startpagina</li>
        <li>🔍 Zoeken</li>
        <li>🧭 Ontdekken</li>
        <li>🎥 Reels</li>
        <li>✉️ Berichten</li>
        <li>❤️ Meldingen</li>
        <li>➕ Maken</li>
        <li>👤 Profiel</li>
        <li># Threads</li>
        <li>⋯ Meer</li>
      </ul>
    </div>
  );
};

export default Sidebar;

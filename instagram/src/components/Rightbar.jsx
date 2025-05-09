import React from "react";
import "../styles/Rightbar.css";

const Rightbar = () => {
  const suggestions = [
    { id: 1, name: "new_user1" },
    { id: 2, name: "coolguy" },
    { id: 3, name: "photofan" },
  ];

  return (
    <div className="rightbar">
      <h3>Voorgestelde accounts</h3>
      <ul>
        {suggestions.map((user) => (
          <li key={user.id}>
            <span>{user.name}</span> <button>Volgen</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rightbar;

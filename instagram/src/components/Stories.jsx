import React from "react";
import "../styles/Stories.css";

const users = [
  { id: 1, name: "rune", image: "https://via.placeholder.com/50" },
  { id: 2, name: "jane", image: "https://via.placeholder.com/50" },
  { id: 3, name: "bob", image: "https://via.placeholder.com/50" },
  { id: 4, name: "alice", image: "https://via.placeholder.com/50" },
];

const Stories = () => {
  return (
    <div className="stories">
      {users.map((user) => (
        <div className="story" key={user.id}>
          <img src={user.image} alt="story" />
          <p>{user.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Stories;

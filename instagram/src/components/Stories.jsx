// Stories.jsx
import React from "react";
import "../styles/Stories.css";
import runeImage from "../assets/images/rune.webp"; // Zorg ervoor dat het pad correct is

// Definieer gebruikers en hun story-afbeeldingen
const users = [
  { id: 1, name: "rune", image: runeImage },
  { id: 2, name: "john_doe", image: "path_to_image" },
  { id: 3, name: "susan_smith", image: "path_to_image" },
  // Voeg meer gebruikers toe als nodig
];

const Stories = () => {
  return (
    <div className="stories">
      {users.map((user) => (
        <div className="story" key={user.id}>
          <img src={user.image} alt={user.name} className="story-image" />
          <p>{user.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Stories;

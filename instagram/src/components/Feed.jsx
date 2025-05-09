// Feed.jsx
import React from "react";
import Post from "./Post"; // Importeer de Post-component met 'default import'

const Feed = () => {
  const posts = [
    {
      id: 1,
      username: "rune_dev",
      image: "path_to_image", // Zorg ervoor dat je een geldig pad hebt voor de afbeelding
      caption: "Mijn eerste post!",
    },
    {
      id: 2,
      username: "john_doe",
      image: "path_to_image", // Zorg ervoor dat je een geldig pad hebt voor de afbeelding
      caption: "Wat een dag! ☀️",
    },
  ];

  return (
    <div className="feed">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Feed;

import React from "react";
import Stories from "./Stories";
import Post from "./Post";
import "../styles/Feed.css";

const Feed = () => {
  const posts = [
    {
      id: 1,
      username: "rune_dev",
      image: "https://via.placeholder.com/400x300",
      caption: "Mijn eerste post!",
    },
    {
      id: 2,
      username: "john_doe",
      image: "https://via.placeholder.com/400x300",
      caption: "Wat een dag! ☀️",
    },
  ];

  return (
    <div className="feed">
      <Stories />
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Feed;

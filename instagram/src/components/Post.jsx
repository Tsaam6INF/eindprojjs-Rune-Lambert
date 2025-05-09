import React from "react";
import "../styles/Post.css";

const Post = ({ username, image, caption }) => {
  return (
    <div className="post">
      <h3>{username}</h3>
      <img src={image} alt="post" />
      <p>{caption}</p>
    </div>
  );
};

export default Post;

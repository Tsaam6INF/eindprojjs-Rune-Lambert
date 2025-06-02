// Bovenin:
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home({ username, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/photos");
      setPhotos(res.data);

      res.data.forEach(async (photo) => {
        const likesRes = await axios.get(
          `http://localhost:3001/api/photos/${photo.id}/likes`
        );
        setLikes((prev) => ({
          ...prev,
          [photo.id]: likesRes.data.map((l) => l.username),
        }));

        const commentsRes = await axios.get(
          `http://localhost:3001/api/photos/${photo.id}/comments`
        );
        setComments((prev) => ({
          ...prev,
          [photo.id]: commentsRes.data,
        }));
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async (photoId) => {
    if (!username) {
      alert("Je moet ingelogd zijn om te liken.");
      return;
    }
    try {
      await axios.post(`http://localhost:3001/api/photos/${photoId}/like`, {
        username,
      });
      const likesRes = await axios.get(
        `http://localhost:3001/api/photos/${photoId}/likes`
      );
      setLikes((prev) => ({
        ...prev,
        [photoId]: likesRes.data.map((l) => l.username),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentChange = (photoId, text) => {
    setNewComments((prev) => ({ ...prev, [photoId]: text }));
  };

  const handleAddComment = async (photoId) => {
    if (!username) {
      alert("Je moet ingelogd zijn om een comment te plaatsen.");
      return;
    }
    const comment = newComments[photoId];
    if (!comment || comment.trim() === "") return;

    try {
      await axios.post(`http://localhost:3001/api/photos/${photoId}/comment`, {
        username,
        comment,
      });
      const commentsRes = await axios.get(
        `http://localhost:3001/api/photos/${photoId}/comments`
      );
      setComments((prev) => ({
        ...prev,
        [photoId]: commentsRes.data,
      }));
      setNewComments((prev) => ({ ...prev, [photoId]: "" }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          padding: "10px",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#f8f8f8",
        }}
      >
        <button onClick={goToProfile}>Profiel</button>
        <button onClick={logout}>Uitloggen</button>
      </nav>

      <div style={{ padding: "20px" }}>
        <h2>📸 Alle foto's</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          {photos.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                maxWidth: "600px",
              }}
            >
              <p>
                <strong>📸 {p.user}</strong>
              </p>
              <img
                src={`http://localhost:3001/uploads/${p.filename}`}
                alt={p.description}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              {p.description && (
                <p style={{ marginTop: "10px" }}>{p.description}</p>
              )}
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleLike(p.id)}>👍 Like</button>
                <span style={{ marginLeft: "10px" }}>
                  {likes[p.id]?.length || 0} likes
                </span>
              </div>

              <div style={{ marginTop: "15px" }}>
                <strong>Comments:</strong>
                {comments[p.id]?.length === 0 && <p>Geen comments.</p>}
                <ul>
                  {comments[p.id]?.map((c) => (
                    <li key={c.id}>
                      <b>{c.username}</b>: {c.comment}
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Voeg een comment toe"
                  value={newComments[p.id] || ""}
                  onChange={(e) => handleCommentChange(p.id, e.target.value)}
                  style={{ width: "80%", marginRight: "10px" }}
                />
                <button onClick={() => handleAddComment(p.id)}>Plaats</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

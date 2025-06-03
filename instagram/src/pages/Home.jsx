import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home({ username, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [likes, setLikes] = useState({});
  const [shares, setShares] = useState({}); // Nieuwe state voor shares
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
        // Likes ophalen
        const likesRes = await axios.get(
          `http://localhost:3001/api/photos/${photo.id}/likes`
        );
        setLikes((prev) => ({
          ...prev,
          [photo.id]: likesRes.data.map((l) => l.username),
        }));

        // Shares ophalen - zorg dat je hiervoor een endpoint hebt!
        const sharesRes = await axios.get(
          `http://localhost:3001/api/photos/${photo.id}/shares`
        );
        setShares((prev) => ({
          ...prev,
          [photo.id]: sharesRes.data.count, // Hier verwacht ik dat sharesRes.data.count een nummer is
        }));

        // Comments ophalen
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

  const handleShare = async (photoId) => {
    if (!username) {
      alert("Je moet ingelogd zijn om te delen.");
      return;
    }
    try {
      await axios.post(`http://localhost:3001/api/photos/${photoId}/share`, {
        username,
      });
      const sharesRes = await axios.get(
        `http://localhost:3001/api/photos/${photoId}/shares`
      );
      setShares((prev) => ({
        ...prev,
        [photoId]: sharesRes.data.count,
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
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>Instagram</h1>
        <div>
          <button onClick={goToProfile} style={styles.navButton}>
            Profiel
          </button>
          <button onClick={logout} style={styles.navButton}>
            Uitloggen
          </button>
        </div>
      </nav>

      <main style={styles.feed}>
        {photos
          .slice()
          .reverse()
          .map((p) => (
            <div key={p.id} style={styles.post}>
              <div style={styles.header}>
                <strong>{p.user}</strong>
              </div>
              <div style={styles.imageWrapper}>
                <img
                  src={`http://localhost:3001/uploads/${p.filename}`}
                  alt={p.description}
                  style={styles.image}
                />
              </div>
              {p.description && (
                <p style={styles.description}>{p.description}</p>
              )}
              <div style={styles.actions}>
                <button
                  onClick={() => handleLike(p.id)}
                  style={styles.likeBtn}
                  aria-label="Like"
                >
                  ❤️
                </button>
                <span>{likes[p.id]?.length || 0} likes</span>

                {/* Share knop en count */}
                <button
                  onClick={() => handleShare(p.id)}
                  style={styles.shareBtn}
                  aria-label="Share"
                >
                  📤
                </button>
                <span>{shares[p.id] || 0} shares</span>
              </div>
              <div style={styles.comments}>
                {comments[p.id]?.length === 0 && (
                  <p style={styles.noComments}>Geen reacties</p>
                )}
                <ul>
                  {comments[p.id]?.map((c) => (
                    <li key={c.id}>
                      <b>{c.username}</b>: {c.comment}
                    </li>
                  ))}
                </ul>
                <div style={styles.commentBox}>
                  <input
                    type="text"
                    placeholder="Plaats een reactie..."
                    value={newComments[p.id] || ""}
                    onChange={(e) => handleCommentChange(p.id, e.target.value)}
                    style={styles.commentInput}
                  />
                  <button
                    onClick={() => handleAddComment(p.id)}
                    style={styles.commentButton}
                  >
                    Plaats
                  </button>
                </div>
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#fafafa",
    fontFamily: "Arial, sans-serif",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    borderBottom: "1px solid #dbdbdb",
    backgroundColor: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Grand Hotel', cursive",
    fontSize: "32px",
  },
  navButton: {
    marginLeft: "10px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #dbdbdb",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  feed: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 10px",
  },
  post: {
    backgroundColor: "#fff",
    border: "1px solid #dbdbdb",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "470px",
    marginBottom: "30px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  header: {
    padding: "10px 15px",
    borderBottom: "1px solid #eee",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  description: {
    padding: "10px 15px",
    fontSize: "14px",
  },
  actions: {
    padding: "0 15px 10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  likeBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  shareBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  comments: {
    padding: "0 15px 10px",
    fontSize: "14px",
  },
  noComments: {
    fontStyle: "italic",
    color: "#888",
  },
  commentBox: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  commentInput: {
    flexGrow: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  commentButton: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#0095f6",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

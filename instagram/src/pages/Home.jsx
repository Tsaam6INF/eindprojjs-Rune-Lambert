// React hooks importeren
import { useEffect, useState } from "react";
// Hook om programmatically te navigeren (bv. naar login of profiel)
import { useNavigate } from "react-router-dom";
// Axios wordt gebruikt voor HTTP-verzoeken naar de backend API
import axios from "axios";

// De Home-component ontvangt props:
// - username: de huidige ingelogde gebruiker
// - setIsLoggedIn: functie om de loginstatus bij te werken
export default function Home({ username, setIsLoggedIn }) {
  // useNavigate laat je toe om via code naar andere routes te gaan
  const navigate = useNavigate();

  // ========== STATE MANAGEMENT ==========

  // Lijst van foto's die getoond worden in de feed
  const [photos, setPhotos] = useState([]);

  // Elke foto kan een lijst likes hebben (we gebruiken een object met photoId als key)
  const [likes, setLikes] = useState({});

  // Elk item houdt het aantal keren bij dat het gedeeld werd
  const [shares, setShares] = useState({});

  // Reacties per foto (opnieuw per photoId)
  const [comments, setComments] = useState({});

  // Tijdelijke opslag van een nieuwe reactie terwijl de gebruiker typt
  const [newComments, setNewComments] = useState({});

  // ========== AUTHENTICATIE ==========

  // Uitloggen: verwijdert de token en gebruikersnaam uit localStorage,
  // zet de loginstatus op false, en navigeert naar de loginpagina
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false); // informeert de bovenliggende component
    navigate("/login");
  };

  // Navigatie naar de profielpagina
  const goToProfile = () => {
    navigate("/profile");
  };

  // ========== DATA OPHALEN ==========

  // Bij het laden van de component, foto’s en bijhorende info ophalen
  useEffect(() => {
    fetchPhotos();
  }, []);

  // Foto’s en alle gerelateerde data (likes, shares, comments) ophalen
  const fetchPhotos = async () => {
    try {
      // Eerst alle foto's ophalen via de API
      const res = await axios.get("http://localhost:3001/api/photos");
      setPhotos(res.data);

      // Voor elke foto halen we ook apart de likes, shares en comments op
      // Dit zou geoptimaliseerd kunnen worden door 1 samengestelde API-route
      res.data.forEach(async (photo) => {
        // Likes ophalen
        const likesRes = await axios.get(
          `http://localhost:3001/api/photos/${photo.id}/likes`
        );
        setLikes((prev) => ({
          ...prev,
          [photo.id]: likesRes.data.map((l) => l.username),
        }));

        // Shares ophalen — je backend moet dit ondersteunen
        const sharesRes = await axios.get(
          `http://localhost:3001/api/photos/${photo.id}/shares`
        );
        setShares((prev) => ({
          ...prev,
          [photo.id]: sharesRes.data.count,
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
      console.error("Fout bij ophalen van foto's of bijbehorende data:", error);
    }
  };

  // ========== INTERACTIES (LIKE, SHARE, COMMENT) ==========

  // Gebruiker liket een foto
  const handleLike = async (photoId) => {
    if (!username) {
      alert("Je moet ingelogd zijn om een foto te liken.");
      return;
    }

    try {
      // POST-verzoek om like toe te voegen
      await axios.post(`http://localhost:3001/api/photos/${photoId}/like`, {
        username,
      });

      // Likes opnieuw ophalen om UI te verversen
      const likesRes = await axios.get(
        `http://localhost:3001/api/photos/${photoId}/likes`
      );
      setLikes((prev) => ({
        ...prev,
        [photoId]: likesRes.data.map((l) => l.username),
      }));
    } catch (error) {
      console.error("Fout bij liken van foto:", error);
    }
  };

  // Gebruiker deelt een foto (simulatie, tenzij er echte deelmechanismen zijn)
  const handleShare = async (photoId) => {
    if (!username) {
      alert("Je moet ingelogd zijn om te delen.");
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/photos/${photoId}/share`, {
        username,
      });

      // Shares opnieuw ophalen na delen
      const sharesRes = await axios.get(
        `http://localhost:3001/api/photos/${photoId}/shares`
      );
      setShares((prev) => ({
        ...prev,
        [photoId]: sharesRes.data.count,
      }));
    } catch (error) {
      console.error("Fout bij delen van foto:", error);
    }
  };

  // Bijhouden wat de gebruiker intypt als reactie (per foto)
  const handleCommentChange = (photoId, text) => {
    setNewComments((prev) => ({
      ...prev,
      [photoId]: text,
    }));
  };

  // Nieuwe comment toevoegen aan een foto
  const handleAddComment = async (photoId) => {
    if (!username) {
      alert("Je moet ingelogd zijn om een reactie te plaatsen.");
      return;
    }

    const comment = newComments[photoId];
    if (!comment || comment.trim() === "") return;

    try {
      await axios.post(`http://localhost:3001/api/photos/${photoId}/comment`, {
        username,
        comment,
      });

      // Comments opnieuw ophalen zodat nieuwe zichtbaar wordt
      const commentsRes = await axios.get(
        `http://localhost:3001/api/photos/${photoId}/comments`
      );
      setComments((prev) => ({
        ...prev,
        [photoId]: commentsRes.data,
      }));

      // Invoerveld leegmaken
      setNewComments((prev) => ({
        ...prev,
        [photoId]: "",
      }));
    } catch (error) {
      console.error("Fout bij toevoegen van reactie:", error);
    }
  };

  // ========== UI RENDERING ==========

  return (
    <div style={styles.page}>
      {/* Navigatiebalk bovenaan */}
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

      {/* Hoofdfeed met alle foto's */}
      <main style={styles.feed}>
        {photos
          .slice()
          .reverse() // Nieuwste eerst tonen
          .map((p) => (
            <div key={p.id} style={styles.post}>
              {/* Gebruikersnaam van wie de foto heeft gepost */}
              <div style={styles.header}>
                <strong>{p.user}</strong>
              </div>

              {/* Afbeelding zelf */}
              <div style={styles.imageWrapper}>
                <img
                  src={`http://localhost:3001/uploads/${p.filename}`}
                  alt={p.description}
                  style={styles.image}
                  onError={
                    (e) => (e.target.src = "/placeholder.jpg") // fallback als de image ontbreekt
                  }
                />
              </div>

              {/* Beschrijving onder de foto */}
              {p.description && (
                <p style={styles.description}>{p.description}</p>
              )}

              {/* Like- en Share-knoppen + telling */}
              <div style={styles.actions}>
                <button onClick={() => handleLike(p.id)} style={styles.likeBtn}>
                  ❤️
                </button>
                <span>{likes[p.id]?.length || 0} likes</span>

                <button
                  onClick={() => handleShare(p.id)}
                  style={styles.shareBtn}
                >
                  📤
                </button>
                <span>{shares[p.id] || 0} shares</span>
              </div>

              {/* Reacties weergeven */}
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

                {/* Invoerveld voor nieuwe reactie */}
                <div style={styles.commentBox}>
                  <input
                    type="text"
                    placeholder="Plaats een reactie..."
                    value={newComments[p.id] || ""}
                    onChange={(e) => handleCommentChange(p.id, e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddComment(p.id)
                    }
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

// ========== INLINE STYLING ==========
// Stijlen zijn opgenomen als JS-objecten voor eenvoud. Kan vervangen worden door CSS of Tailwind.
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

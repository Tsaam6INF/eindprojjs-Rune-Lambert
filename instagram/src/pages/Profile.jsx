import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = ({ username }) => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/photos/${username}`
      );
      setPhotos(response.data.reverse());
    } catch (error) {
      console.error("Fout bij ophalen foto's:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [username]);

  const uploadPhoto = async (e) => {
    e.preventDefault();
    if (!file) return alert("Selecteer een foto");

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("description", description);

    try {
      await axios.post(
        `http://localhost:3001/api/photos/${username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFile(null);
      setDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchPhotos();
    } catch (error) {
      console.error("Fout bij uploaden:", error);
    }
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>
          ← Terug naar Home
        </Link>
      </nav>

      <div style={styles.profileHeader}>
        <div>
          <h2 style={styles.username}>{username}</h2>
          <p style={{ color: "#666" }}>{photos.length} foto's</p>
        </div>
      </div>

      <form onSubmit={uploadPhoto} style={styles.form}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*"
          style={styles.inputFile}
        />
        <input
          type="text"
          placeholder="Beschrijving"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.inputDesc}
        />
        <button type="submit" style={styles.uploadButton}>
          Upload
        </button>
      </form>

      <h3 style={styles.sectionTitle}>📷 Foto's</h3>
      {photos.length === 0 ? (
        <p style={{ color: "#999", textAlign: "center" }}>Nog geen foto's.</p>
      ) : (
        <div style={styles.grid}>
          {photos.map((photo) => (
            <div key={photo.id} style={styles.gridItem}>
              <img
                src={`http://localhost:3001/uploads/${photo.filename}`}
                alt="upload"
                style={styles.image}
              />
              {photo.description && (
                <div style={styles.caption}>{photo.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#fafafa",
    fontFamily: "Arial, sans-serif",
    paddingBottom: "40px",
  },
  nav: {
    backgroundColor: "#fff",
    borderBottom: "1px solid #dbdbdb",
    padding: "15px 30px",
  },
  navLink: {
    textDecoration: "none",
    color: "#0095f6",
    fontWeight: "bold",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    padding: "30px",
  },
  username: {
    fontSize: "24px",
    marginBottom: "5px",
  },
  form: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 30px 30px",
  },
  inputFile: {
    border: "1px solid #ccc",
    padding: "5px",
  },
  inputDesc: {
    flexGrow: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  uploadButton: {
    backgroundColor: "#0095f6",
    color: "white",
    fontWeight: "bold",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  sectionTitle: {
    paddingLeft: "30px",
    marginBottom: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "10px",
    padding: "0 30px",
  },
  gridItem: {
    position: "relative",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    borderRadius: "4px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  caption: {
    position: "absolute",
    bottom: "0",
    width: "100%",
    padding: "5px 10px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    fontSize: "12px",
    textAlign: "left",
  },
};

export default Profile;

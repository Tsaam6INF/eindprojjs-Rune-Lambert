import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = ({ username }) => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/photos/${username}`
      );
      setPhotos(response.data);
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
      fetchPhotos();
    } catch (error) {
      console.error("Fout bij uploaden:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <nav
        style={{
          backgroundColor: "#282c34",
          padding: "10px 20px",
          marginBottom: "20px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Home
        </Link>
      </nav>

      <h2>Profiel van {username}</h2>

      <form onSubmit={uploadPhoto} style={{ marginBottom: "20px" }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*"
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Beschrijving"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "10px", width: "200px" }}
        />
        <button type="submit">Upload foto</button>
      </form>

      <h3>Foto's:</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        {photos.length === 0 ? (
          <p>Geen foto's gevonden.</p>
        ) : (
          photos.map((photo) => (
            <div key={photo.id}>
              <img
                src={`http://localhost:3001/uploads/${photo.filename}`}
                alt="user photo"
                style={{
                  width: "400px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
              {photo.description && (
                <p style={{ marginTop: "8px" }}>{photo.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;

// Importeer React functies: useEffect voor lifecycle hooks,
// useRef voor het refereren aan DOM-elementen,
// en useState voor lokale state management.
import React, { useEffect, useRef, useState } from "react";

// Axios wordt gebruikt voor HTTP-verzoeken naar de backend API
import axios from "axios";

// Link van react-router-dom om navigatie mogelijk te maken zonder pagina herladen
import { Link } from "react-router-dom";

/**
 * Profile component toont de profielfoto's van een gebruiker en
 * laat nieuwe foto's uploaden met een optionele beschrijving.
 *
 * @param {Object} props
 * @param {string} props.username - De gebruikersnaam van het profiel
 */
const Profile = ({ username }) => {
  // State variabele om de lijst van foto's op te slaan die van de server komen
  const [photos, setPhotos] = useState([]);

  // State om de geselecteerde bestand (foto) te bewaren die geüpload gaat worden
  const [file, setFile] = useState(null);

  // State voor de optionele omschrijving bij de foto
  const [description, setDescription] = useState("");

  // useRef om direct toegang te hebben tot het file input element in de DOM,
  // zodat we het kunnen resetten na uploaden.
  const fileInputRef = useRef(null);

  /**
   * Haalt alle foto's van de gebruiker op van de backend.
   * Wordt aangeroepen bij laden van de component en telkens als 'username' verandert.
   */
  const fetchPhotos = async () => {
    try {
      // HTTP GET naar API endpoint om foto's op te halen
      const response = await axios.get(
        `http://localhost:3001/api/photos/${username}`
      );

      // React state updaten met ontvangen data
      // We keren de lijst om zodat nieuwste foto's bovenaan staan
      setPhotos(response.data.reverse());
    } catch (error) {
      // Foutmelding in console bij mislukte API-aanroep
      console.error("Fout bij ophalen foto's:", error);
    }
  };

  // useEffect om fetchPhotos aan te roepen zodra component mount of username wijzigt
  useEffect(() => {
    fetchPhotos();
  }, [username]);

  /**
   * Handler voor het uploaden van een nieuwe foto.
   * - Voorkomt standaard form submit gedrag
   * - Controleert of een bestand geselecteerd is
   * - Maakt FormData object aan met foto en beschrijving
   * - Stuurt POST request naar backend om de foto te uploaden
   * - Reset input velden en haalt foto's opnieuw op na upload
   */
  const uploadPhoto = async (e) => {
    e.preventDefault(); // voorkom pagina herladen

    // Check of er een bestand is geselecteerd
    if (!file) return alert("Selecteer een foto");

    // FormData is noodzakelijk voor multipart/form-data uploads (bestanden)
    const formData = new FormData();
    formData.append("photo", file); // voeg foto toe aan formulierdata
    formData.append("description", description); // voeg optionele beschrijving toe

    try {
      // Verstuur POST request naar backend met de foto en beschrijving
      await axios.post(
        `http://localhost:3001/api/photos/${username}`,
        formData,
        {
          headers: {
            // Content-Type wordt automatisch door Axios en browser gezet bij FormData,
            // maar hier expliciet aangegeven voor duidelijkheid
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Na succesvolle upload: reset de geselecteerde file en beschrijving
      setFile(null);
      setDescription("");

      // Reset ook het file input veld visueel via de ref
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Haal de foto's opnieuw op om de nieuwe foto direct te tonen
      fetchPhotos();
    } catch (error) {
      // Foutmelding in console bij mislukte upload
      console.error("Fout bij uploaden:", error);
    }
  };

  // JSX structuur van de component
  return (
    <div style={styles.page}>
      {/* Navigatiebalk met terug-link naar homepage */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>
          ← Terug naar Home
        </Link>
      </nav>

      {/* Profielheader met gebruikersnaam en aantal foto's */}
      <div style={styles.profileHeader}>
        <div>
          <h2 style={styles.username}>{username}</h2>
          {/* Toon aantal foto's dat is opgehaald */}
          <p style={{ color: "#666" }}>{photos.length} foto's</p>
        </div>
      </div>

      {/* Formulier voor foto upload: bestand kiezen + optionele beschrijving */}
      <form onSubmit={uploadPhoto} style={styles.form}>
        {/* File input, gekoppeld aan ref voor reset */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])} // update state bij selectie
          accept="image/*" // beperk tot afbeeldingen
          style={styles.inputFile}
        />

        {/* Tekst input voor optionele omschrijving */}
        <input
          type="text"
          placeholder="Beschrijving"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // update state bij typen
          style={styles.inputDesc}
        />

        {/* Upload knop */}
        <button type="submit" style={styles.uploadButton}>
          Upload
        </button>
      </form>

      {/* Sectie titel voor foto's */}
      <h3 style={styles.sectionTitle}>📷 Foto's</h3>

      {/* Conditie: als geen foto's, toon melding; anders toon foto's grid */}
      {photos.length === 0 ? (
        <p style={{ color: "#999", textAlign: "center" }}>Nog geen foto's.</p>
      ) : (
        <div style={styles.grid}>
          {/* Map over de foto's en render elke foto met optionele beschrijving */}
          {photos.map((photo) => (
            <div key={photo.id} style={styles.gridItem}>
              {/* Foto afbeelding */}
              <img
                src={`http://localhost:3001/uploads/${photo.filename}`}
                alt="upload"
                style={styles.image}
              />
              {/* Optionele onderschrift */}
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

/**
 * Styles object met inline CSS stijlen.
 * Hiermee worden elementen visueel vormgegeven zonder aparte CSS bestanden.
 */
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
    aspectRatio: "1 / 1", // vierkante verhouding
    overflow: "hidden",
    borderRadius: "4px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // afbeelding vult container, wordt bijgesneden indien nodig
  },
  caption: {
    position: "absolute",
    bottom: "0",
    width: "100%",
    padding: "5px 10px",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // donker doorzichtige overlay
    color: "#fff",
    fontSize: "12px",
    textAlign: "left",
  },
};

// Exporteer de component zodat deze geïmporteerd en gebruikt kan worden in andere bestanden
export default Profile;

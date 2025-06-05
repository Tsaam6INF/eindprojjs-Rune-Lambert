// Importeer React Hook 'useState' om interne state te beheren binnen deze functionele component
import { useState } from "react";

// Importeer 'Link' van React Router om gebruikers toe te laten naar de registratiepagina te navigeren
// zonder de volledige pagina opnieuw te laden
import { Link } from "react-router-dom";

// Importeer axios om HTTP-verzoeken te versturen naar de backend API
import axios from "axios";

/**
 * De Login-component is verantwoordelijk voor:
 * - Het tonen van een loginformulier met gebruikersnaam en wachtwoord
 * - Versturen van logingegevens naar de server
 * - Behandelen van een succesvolle of mislukte login
 * - Opslaan van JWT-token en gebruikersnaam bij een succesvolle login
 * - Navigeren naar de homepage na login
 */
function Login() {
  // Lokale state voor het bijhouden van invoervelden (controlled components)
  const [username, setUsername] = useState(""); // Gebruikersnaam die wordt ingevuld
  const [password, setPassword] = useState(""); // Wachtwoord dat wordt ingevuld

  // Foutmelding die getoond wordt als login niet lukt (bijv. fout wachtwoord)
  const [error, setError] = useState(null);

  /**
   * Wordt aangeroepen wanneer de gebruiker het formulier indient.
   * Voorkomt standaard gedrag (page reload), verstuurt de login data naar de backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Voorkom automatisch herladen van de pagina bij form-submit

    try {
      // Verstuur POST-verzoek naar backend API met gebruikersnaam en wachtwoord
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        username,
        password,
      });

      // Als login succesvol is, ontvang je een JWT-token en gebruikersdata
      // Sla deze gegevens op in de browser's localStorage zodat ze bewaard blijven tussen pagina's
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);

      // Navigeer naar de homepage ("/"). Opmerking: dit forceert een volledige pagina-refresh
      window.location.href = "/";
    } catch (err) {
      // Als login mislukt (bijv. onjuiste login of server offline), stel foutbericht in
      setError("Login mislukt, controleer je gegevens.");
    }
  };

  /**
   * JSX die het loginformulier en bijhorende interface-elementen toont.
   * Bij foutmelding wordt deze visueel weergegeven.
   */
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Titel/logo van de app */}
        <h1 style={styles.logo}>Instagram</h1>

        {/* Loginformulier */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Invoerveld voor gebruikersnaam */}
          <input
            type="text"
            placeholder="Gebruikersnaam"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // update state bij typen
            required // HTML5-validatie: veld mag niet leeg zijn
            style={styles.input}
          />

          {/* Invoerveld voor wachtwoord */}
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // update state bij typen
            required
            style={styles.input}
          />

          {/* Inlogknop */}
          <button type="submit" style={styles.button}>
            Inloggen
          </button>
        </form>

        {/* Foutmelding als login niet lukt */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Navigatielink naar registratiepagina */}
        <div style={styles.footerText}>
          <p>
            Nog geen account?{" "}
            <Link to="/register" style={styles.link}>
              Registreren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline CSS-stijlen als JavaScript-objecten.
 * Deze stijlen zijn gekoppeld aan componenten via de 'style' prop.
 * Alternatieven zijn CSS-modules of utility-first CSS (zoals Tailwind CSS).
 */
const styles = {
  // Buitenste container met gecentreerde inhoud
  container: {
    backgroundColor: "#fafafa", // lichtgrijze achtergrond
    minHeight: "100vh", // schermvullend in de hoogte
    display: "flex",
    justifyContent: "center",
    alignItems: "center", // center vertically
  },
  // Kaartvormige login box
  card: {
    backgroundColor: "white",
    border: "1px solid #dbdbdb",
    padding: "40px",
    width: "350px",
    textAlign: "center",
    borderRadius: "8px",
  },
  // Logo stijlen: font en grootte
  logo: {
    fontFamily: "'Grand Hotel', cursive", // Instagram-achtig lettertype
    fontSize: "40px",
    marginBottom: "30px",
  },
  // Formulier container
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px", // ruimte tussen inputs
  },
  // Stijl voor tekstvelden
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #dbdbdb",
    backgroundColor: "#fafafa",
  },
  // Inlogknop
  button: {
    padding: "10px",
    backgroundColor: "#0095f6", // Instagram blauw
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  // Foutmeldingen (bij mislukte login)
  error: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },
  // Tekst onderaan (bijv. "Nog geen account?")
  footerText: {
    marginTop: "20px",
    fontSize: "14px",
  },
  // Stijl voor navigatielink naar registratie
  link: {
    color: "#00376b", // donkerblauw zoals Instagram
    textDecoration: "none",
    fontWeight: "bold",
  },
};

// Exporteer de Login-component zodat deze beschikbaar is in andere bestanden
export default Login;

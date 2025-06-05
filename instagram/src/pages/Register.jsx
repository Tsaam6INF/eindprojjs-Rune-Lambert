// Importeer React en useState hook voor state management
import React, { useState } from "react";
// Axios voor het maken van HTTP requests naar backend API
import axios from "axios";
// Link van react-router-dom voor navigatie binnen de app zonder herladen
import { Link } from "react-router-dom";

/**
 * Register component: formulier voor gebruikersregistratie.
 * Hiermee kunnen nieuwe gebruikers een account aanmaken.
 */
const Register = () => {
  // State variabele voor het invoeren van de gebruikersnaam
  const [username, setUsername] = useState("");
  // State variabele voor het invoeren van het wachtwoord
  const [password, setPassword] = useState("");
  // State voor het opslaan van eventuele foutmeldingen
  const [error, setError] = useState(null);
  // State die aangeeft of registratie gelukt is (true/false)
  const [success, setSuccess] = useState(false);

  /**
   * Functie die wordt aangeroepen bij het submitten van het registratieformulier.
   * Probeert een POST request te sturen naar de backend om een nieuwe gebruiker te registreren.
   * Bij succes worden invoervelden gereset en wordt een succesmelding getoond.
   * Bij een fout wordt een foutmelding weergegeven.
   */
  const register = async (e) => {
    e.preventDefault(); // voorkom dat de pagina herlaadt bij formulier submit

    try {
      // Verstuur POST request met username en password naar backend endpoint
      const res = await axios.post("http://localhost:3001/api/auth/register", {
        username,
        password,
      });

      // Als registratie gelukt is:
      setSuccess(true); // toon succesmelding
      setError(null); // reset eventuele fouten
      setUsername(""); // leeg gebruikersnaam veld
      setPassword(""); // leeg wachtwoord veld
    } catch (err) {
      // Bij fout in registratie: log de fout en toon gebruikersvriendelijke melding
      console.error(err);
      setError("Registratie mislukt, probeer een andere gebruikersnaam.");
      setSuccess(false);
    }
  };

  // JSX van het component
  return (
    <div style={styles.container}>
      {/* Card-container voor het registratieformulier */}
      <div style={styles.card}>
        {/* Titel/logo */}
        <h1 style={styles.logo}>Instagram</h1>

        {/* Registratieformulier */}
        <form onSubmit={register} style={styles.form}>
          {/* Input voor gebruikersnaam */}
          <input
            placeholder="Gebruikersnaam"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // update state bij typen
            required
            style={styles.input}
          />

          {/* Input voor wachtwoord */}
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // update state bij typen
            required
            style={styles.input}
          />

          {/* Submit knop */}
          <button type="submit" style={styles.button}>
            Registreer
          </button>
        </form>

        {/* Foutmelding, alleen getoond als error niet null is */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Succesmelding bij succesvolle registratie */}
        {success && (
          <p style={styles.success}>
            Registratie gelukt! Je kunt nu{" "}
            <Link to="/login" style={styles.link}>
              inloggen
            </Link>
            .
          </p>
        )}

        {/* Footer met link naar inlogpagina voor bestaande gebruikers */}
        <div style={styles.footerText}>
          <p>
            Al een account?{" "}
            <Link to="/login" style={styles.link}>
              Inloggen
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Styles object voor inline styling van de component elementen
const styles = {
  container: {
    backgroundColor: "#fafafa",
    minHeight: "100vh", // vult hele hoogte van scherm
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    border: "1px solid #dbdbdb",
    padding: "40px",
    width: "350px",
    textAlign: "center",
    borderRadius: "8px",
  },
  logo: {
    fontFamily: "'Grand Hotel', cursive", // mooi handschrift font
    fontSize: "40px",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column", // verticaal stapelen
    gap: "10px", // ruimte tussen inputs en knop
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #dbdbdb",
    backgroundColor: "#fafafa",
  },
  button: {
    padding: "10px",
    backgroundColor: "#0095f6",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontSize: "14px",
  },
  success: {
    color: "green",
    marginTop: "10px",
    fontSize: "14px",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "14px",
  },
  link: {
    color: "#00376b",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

// Export van de component zodat deze gebruikt kan worden in andere delen van de app
export default Register;

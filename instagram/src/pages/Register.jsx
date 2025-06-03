import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/auth/register", {
        username,
        password,
      });
      setSuccess(true);
      setError(null);
      setUsername(""); // ⬅️ velden leegmaken na succesvolle registratie
      setPassword("");
    } catch (err) {
      console.error(err);
      setError("Registratie mislukt, probeer een andere gebruikersnaam.");
      setSuccess(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Instagram</h1>
        <form onSubmit={register} style={styles.form}>
          <input
            placeholder="Gebruikersnaam"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Registreer
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        {success && (
          <p style={styles.success}>
            Registratie gelukt! Je kunt nu{" "}
            <Link to="/login" style={styles.link}>
              inloggen
            </Link>
            .
          </p>
        )}
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

const styles = {
  container: {
    backgroundColor: "#fafafa",
    minHeight: "100vh",
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
    fontFamily: "'Grand Hotel', cursive",
    fontSize: "40px",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
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

export default Register;

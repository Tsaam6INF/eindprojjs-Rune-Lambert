import express from "express";
import path from "path";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Connectie met dezelfde database
const db = new sqlite3.Database(path.join(__dirname, "../sqlite.db"));

// Register
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Vul alle velden in." });
  }

  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

  db.run(query, [username, password], function (err) {
    if (err) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ message: "Gebruikersnaam bestaat al." });
      }
      return res.status(500).json({ message: "Fout bij registreren." });
    }

    res
      .status(201)
      .json({ message: "Gebruiker geregistreerd!", userId: this.lastID });
  });
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(query, [username, password], (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Fout bij inloggen." });
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Ongeldige gebruikersnaam of wachtwoord." });
    }

    // Simpele token (voor demo, vervang door JWT in productie)
    const token = "dummy-token-" + user.id;

    res.status(200).json({
      message: "Ingelogd!",
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  });
});

export default router;

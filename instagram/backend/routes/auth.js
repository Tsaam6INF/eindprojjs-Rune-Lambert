const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const router = express.Router();

// Verbind met database
const dbPath = path.resolve(__dirname, "../sqlite.db");
const db = new sqlite3.Database(dbPath);

// Zorg dat de users-tabel bestaat
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// 📌 Register route
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

// 📌 Login route
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

    res.status(200).json({ message: "Ingelogd!", user });
  });
});

module.exports = router;

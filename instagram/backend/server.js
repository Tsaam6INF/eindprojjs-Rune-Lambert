// =======================
// 📦 IMPORTS
// =======================

// Express is het framework voor het bouwen van de webserver en API-routes
import express from "express";

// Multer wordt gebruikt om bestanden (zoals afbeeldingen) te uploaden
import multer from "multer";

// SQLite is een lichte database die lokaal draait (geen aparte server nodig)
import sqlite3 from "sqlite3";

// CORS zorgt ervoor dat de frontend requests mag maken naar de backend, ook al draaien ze op andere poorten
import cors from "cors";

// Path en fileURLToPath worden gebruikt om correcte padnamen te bepalen in een ES Module context
import path from "path";
import { fileURLToPath } from "url";

// Losse router voor authenticatie (login/register)
import authRouter from "./routes/auth.js";

// =======================
// 📍 Padconfiguratie (__dirname workaround voor ES Modules)
// =======================

const __filename = fileURLToPath(import.meta.url); // Geeft de bestandsnaam van dit bestand
const __dirname = path.dirname(__filename); // Bepaalt de directory waarin dit bestand zich bevindt

// =======================
// 🚀 Setup van Express App
// =======================

const app = express(); // Initieer Express app
const PORT = 3001; // Server draait lokaal op poort 3001 (frontend op 3000?)

// Middleware
app.use(cors()); // Sta frontend toe (CORS voorkomt 'Access-Control-Allow-Origin'-fouten)
app.use(express.json()); // Laat toe dat JSON data in request body gelezen kan worden

// Maak de 'uploads'-map toegankelijk via de URL (zodat afbeeldingen getoond kunnen worden in frontend)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// 🗃️ DATABASE Initialisatie
// =======================

const db = new sqlite3.Database(path.join(__dirname, "sqlite.db")); // Open of maak databasebestand aan

// Tabel: gebruikers met unieke username en wachtwoord (voor login/register)
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// Tabel: geüploade foto's met bestandsnaam en gebruikersnaam
db.run(`CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT NOT NULL,
  filename TEXT NOT NULL
)`);

// Controleer of er al een kolom 'description' is in de 'photos' tabel (om upgrade van oudere versies te ondersteunen)
db.all("PRAGMA table_info(photos)", (err, columns) => {
  if (err) {
    console.error("Fout bij ophalen van tabelinfo:", err);
    return;
  }
  const hasDescription = columns.some((col) => col.name === "description");
  if (!hasDescription) {
    db.run(`ALTER TABLE photos ADD COLUMN description TEXT`);
  }
});

// Tabel: likes, één per gebruiker per foto (unieke combinatie via constraint)
db.run(`CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  UNIQUE(photo_id, username)
)`);

// Tabel: comments op foto's met timestamp (zodat we ze chronologisch kunnen tonen)
db.run(`CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Tabel: gedeelde foto's (ook max. 1 per gebruiker per foto via UNIQUE)
db.run(`CREATE TABLE IF NOT EXISTS shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  UNIQUE(photo_id, username)
)`);

// =======================
// 🖼️ Multer Configuratie voor Foto Upload
// =======================

// Bepaal hoe en waar bestanden opgeslagen worden
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Opslaglocatie
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname; // Vermijd dubbele bestandsnamen
    cb(null, uniqueName);
  },
});

const upload = multer({ storage }); // Initialiseer upload middleware

// =======================
// 📸 API ENDPOINTS
// =======================

// ➕ Foto uploaden + optionele beschrijving opslaan
app.post("/api/photos/:username", upload.single("photo"), (req, res) => {
  const username = req.params.username;
  const description = req.body.description || "";

  if (!req.file) {
    return res.status(400).json({ error: "Geen bestand geüpload" });
  }

  const filename = req.file.filename;

  db.run(
    "INSERT INTO photos (user, filename, description) VALUES (?, ?, ?)",
    [username, filename, description],
    function (err) {
      if (err) return res.status(500).json({ error: "Database fout" });
      res.json({ id: this.lastID, filename, description }); // Return info over geüploade foto
    }
  );
});

// 🔍 Alle foto's ophalen (voor algemene feed)
app.get("/api/photos", (req, res) => {
  db.all("SELECT id, filename, user, description FROM photos", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database fout" });
    res.json(rows);
  });
});

// 🔍 Alle foto's van één specifieke gebruiker ophalen (voor profielpagina)
app.get("/api/photos/:username", (req, res) => {
  const username = req.params.username;

  db.all(
    "SELECT id, filename, description FROM photos WHERE user = ?",
    [username],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database fout" });
      res.json(rows);
    }
  );
});

// =======================
// ❤️ LIKES
// =======================

// ➕ Like toevoegen (maar slechts 1 keer per foto per gebruiker)
app.post("/api/photos/:photoId/like", (req, res) => {
  const { photoId } = req.params;
  const { username } = req.body;

  if (!username)
    return res.status(400).json({ error: "Username is verplicht" });

  db.run(
    "INSERT OR IGNORE INTO likes (photo_id, username) VALUES (?, ?)",
    [photoId, username],
    function (err) {
      if (err) return res.status(500).json({ error: "Database fout bij like" });

      // ✅ Geef het totale aantal likes terug na toevoegen
      db.get(
        "SELECT COUNT(*) AS count FROM likes WHERE photo_id = ?",
        [photoId],
        (err, row) => {
          if (err)
            return res.status(500).json({ error: "Fout bij tellen likes" });
          res.json({ likes: row.count });
        }
      );
    }
  );
});

// 🔍 Likes ophalen (wie heeft geliked?)
app.get("/api/photos/:photoId/likes", (req, res) => {
  const { photoId } = req.params;

  db.all(
    "SELECT username FROM likes WHERE photo_id = ?",
    [photoId],
    (err, rows) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Database fout bij ophalen likes" });
      res.json(rows);
    }
  );
});

// =======================
// 🔁 SHARES
// =======================

// ➕ Share toevoegen (zelfde logica als likes)
app.post("/api/photos/:photoId/share", (req, res) => {
  const { photoId } = req.params;
  const { username } = req.body;

  if (!username)
    return res.status(400).json({ error: "Username is verplicht" });

  db.run(
    "INSERT OR IGNORE INTO shares (photo_id, username) VALUES (?, ?)",
    [photoId, username],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Database fout bij share" });

      // ✅ Geef het totaal aantal shares terug
      db.get(
        "SELECT COUNT(*) AS count FROM shares WHERE photo_id = ?",
        [photoId],
        (err, row) => {
          if (err)
            return res.status(500).json({ error: "Fout bij tellen shares" });
          res.json({ count: row.count });
        }
      );
    }
  );
});

// 🔍 Aantal shares ophalen
app.get("/api/photos/:photoId/shares", (req, res) => {
  const { photoId } = req.params;

  db.get(
    "SELECT COUNT(*) AS count FROM shares WHERE photo_id = ?",
    [photoId],
    (err, row) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Database fout bij ophalen shares" });
      res.json({ count: row.count });
    }
  );
});

// =======================
// 💬 COMMENTS
// =======================

// ➕ Comment toevoegen aan een foto
app.post("/api/photos/:photoId/comment", (req, res) => {
  const { photoId } = req.params;
  const { username, comment } = req.body;

  if (!username || !comment)
    return res
      .status(400)
      .json({ error: "Username en comment zijn verplicht" });

  db.run(
    "INSERT INTO comments (photo_id, username, comment) VALUES (?, ?, ?)",
    [photoId, username, comment],
    function (err) {
      if (err)
        return res
          .status(500)
          .json({ error: "Database fout bij toevoegen comment" });
      res.json({ id: this.lastID, username, comment });
    }
  );
});

// 🔍 Alle comments van een foto ophalen, nieuwste eerst
app.get("/api/photos/:photoId/comments", (req, res) => {
  const { photoId } = req.params;

  db.all(
    "SELECT id, username, comment, created_at FROM comments WHERE photo_id = ? ORDER BY created_at DESC",
    [photoId],
    (err, rows) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Database fout bij ophalen comments" });
      res.json(rows);
    }
  );
});

// =======================
// 🔐 AUTHENTICATIE ROUTES (register/login)
// =======================
app.use("/api/auth", authRouter); // Externe router voor login/register

// =======================
// 🟢 START SERVER
// =======================
app.listen(PORT, () => {
  console.log(`✅ Server draait op http://localhost:${PORT}`);
});

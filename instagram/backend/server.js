import express from "express";
import multer from "multer";
import sqlite3 from "sqlite3";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = new sqlite3.Database(path.join(__dirname, "sqlite.db"));

// Tabellen aanmaken
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT NOT NULL,
  filename TEXT NOT NULL
)`);

// Description-kolom toevoegen als die nog niet bestaat
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

db.run(`CREATE TABLE IF NOT EXISTS likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  UNIQUE(photo_id, username)
)`);

db.run(`CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

db.run(`CREATE TABLE IF NOT EXISTS shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  photo_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  UNIQUE(photo_id, username)
)`);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Foto uploaden
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
      res.json({ id: this.lastID, filename, description });
    }
  );
});

// Alle foto's ophalen
app.get("/api/photos", (req, res) => {
  db.all("SELECT id, filename, user, description FROM photos", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database fout" });
    res.json(rows);
  });
});

// Foto's van gebruiker ophalen
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

// Like toevoegen
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

// Likes ophalen
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

// Share toevoegen
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

      db.get(
        "SELECT COUNT(*) AS count FROM shares WHERE photo_id = ?",
        [photoId],
        (err, row) => {
          if (err)
            return res.status(500).json({ error: "Fout bij tellen shares" });
          res.json({ count: row.count }); // <-- Fix: stuur count in een object
        }
      );
    }
  );
});

// Shares ophalen
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
      res.json({ count: row.count }); // <-- Fix: stuur count in een object
    }
  );
});

// Comment toevoegen
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

// Comments ophalen
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

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});

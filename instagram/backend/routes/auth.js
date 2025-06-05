// Importeer benodigde Node.js modules en libraries
import express from "express"; // Express is een minimalistisch framework voor het bouwen van webservers
import path from "path"; // Path wordt gebruikt voor bestands- en mapmanipulatie
import sqlite3 from "sqlite3"; // SQLite3 is een lichte relationele database
import { fileURLToPath } from "url"; // Nodig om __dirname te kunnen gebruiken binnen ES Modules (import/export)

// Oplossing voor het ontbreken van __dirname in ES Modules
// __filename geeft het volledige pad naar dit bestand
const __filename = fileURLToPath(import.meta.url);
// __dirname geeft de map van dit bestand
const __dirname = path.dirname(__filename);

// Maak een nieuwe Express router aan
// Routers zijn geïsoleerde "mini-apps" die je kunt koppelen aan je hoofdapp
const router = express.Router();

// Verbind met een SQLite database die zich bevindt in de hoofdmap van het project
// De database wordt opgeslagen in een bestand genaamd sqlite.db
const db = new sqlite3.Database(path.join(__dirname, "../sqlite.db"));

/**
 * ================
 * ROUTE: REGISTER
 * Methode: POST
 * URL: /register
 * Doel: Registreert een nieuwe gebruiker door gebruikersnaam en wachtwoord op te slaan
 * ================
 */
router.post("/register", (req, res) => {
  // Haal gegevens van de gebruiker uit het POST-body object
  const { username, password } = req.body;

  // Controle: zijn beide velden ingevuld?
  if (!username || !password) {
    // Stuur een foutmelding terug als velden leeg zijn
    return res.status(400).json({ message: "Vul alle velden in." });
  }

  // SQL-query om een nieuwe gebruiker toe te voegen aan de "users"-tabel
  // De vraagtekens (?) worden vervangen door de ingevoerde waarden om SQL-injectie te voorkomen
  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

  // Voer de query uit en geef de waarden door als array
  db.run(query, [username, password], function (err) {
    if (err) {
      // Als de gebruikersnaam al bestaat (PRIMARY KEY of UNIQUE constraint)
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ message: "Gebruikersnaam bestaat al." });
      }
      // Algemene fout bij het opslaan in de database
      return res.status(500).json({ message: "Fout bij registreren." });
    }

    // Als alles goed ging, stuur een succesmelding terug met het ID van de nieuwe gebruiker
    res.status(201).json({
      message: "Gebruiker geregistreerd!",
      userId: this.lastID, // this verwijst naar de context van db.run en bevat het laatst ingevoegde ID
    });
  });
});

/**
 * ================
 * ROUTE: LOGIN
 * Methode: POST
 * URL: /login
 * Doel: Verifieert gebruikersgegevens en retourneert een token en gebruikersinformatie
 * ================
 */
router.post("/login", (req, res) => {
  // Haal gebruikersnaam en wachtwoord uit het request-body object
  const { username, password } = req.body;

  // SQL-query om te controleren of er een gebruiker bestaat met deze combinatie
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  // db.get haalt één resultaat op uit de database
  db.get(query, [username, password], (err, user) => {
    if (err) {
      // Als er een fout optreedt bij het uitvoeren van de query
      return res.status(500).json({ message: "Fout bij inloggen." });
    }

    // Als er geen gebruiker wordt gevonden met deze gegevens
    if (!user) {
      return res.status(401).json({
        message: "Ongeldige gebruikersnaam of wachtwoord.",
      });
    }

    // Als de gebruiker bestaat, geef een 'token' terug
    // LET OP: dit is een nep-token voor demonstratiedoeleinden
    // In een echte productieomgeving gebruik je JSON Web Tokens (JWT)
    const token = "dummy-token-" + user.id;

    // Verstuur de response met gebruikersgegevens en token
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

// Exporteer de router zodat deze geïmporteerd kan worden in bijvoorbeeld server.js
export default router;

// --- src/api.js ---
// Importeer axios library om HTTP requests te kunnen maken
import axios from "axios";

// Maak een axios instantie aan met een standaard basis-URL voor alle API calls
// Dit voorkomt dat je telkens de volledige URL hoeft te typen in elke request.
// baseURL wordt gebruikt als prefix voor alle HTTP requests via deze instantie.
const api = axios.create({
  baseURL: "http://localhost:3001/api",
  // Je kunt hier eventueel ook headers, timeouts, interceptors toevoegen als dat nodig is
  // Bijvoorbeeld Authorization headers of andere globale instellingen.
});

// Exporteer deze api instantie zodat andere modules het kunnen importeren
// en gebruiken om requests te maken met een vaste basis-URL.
export default api;

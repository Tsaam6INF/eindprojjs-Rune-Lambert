// --- src/index.js ---
// Importeren van React library
import React from "react";
// Importeren van de ReactDOM client om React componenten in de DOM te plaatsen
import ReactDOM from "react-dom/client";
// Importeren van de hoofdcomponent App die de hele applicatie bevat
import App from "./App";

// Hiermee maken we een "root" React applicatie aan en verbinden die met het HTML-element met id="root"
// Dit element vind je meestal in public/index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // React.StrictMode helpt je om tijdens ontwikkeling mogelijke problemen te detecteren
  // Het activeert extra checks en waarschuwingen, maar verandert niks aan de productie-output
  <React.StrictMode>
    {/* Hier renderen we de hele App component binnen deze React root */}
    <App />
  </React.StrictMode>
);

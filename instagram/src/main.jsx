// Importeren van StrictMode uit React voor extra checks tijdens ontwikkeling
import { StrictMode } from "react";

// Importeren van createRoot functie uit ReactDOM om een root React-app te maken
import { createRoot } from "react-dom/client";

// Importeren van de hoofdcomponent van de app
import App from "./App.jsx";

// Hiermee maken we een React root aan die gekoppeld wordt aan het HTML-element met id="root"
// In dit element wordt de React-app uiteindelijk getoond
createRoot(document.getElementById("root")).render(
  // StrictMode helpt je om problemen in je app vroegtijdig te detecteren door extra checks uit te voeren
  <StrictMode>
    {/* Het renderen van de hoofdcomponent App binnen de root */}
    <App />
  </StrictMode>
);

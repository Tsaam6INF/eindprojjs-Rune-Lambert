import { useState, useEffect } from "react";
// BrowserRouter: zorgt dat je app routing ondersteunt via de browser-URL
// Routes en Route: definiëren verschillende pagina's/routes in je app
// Navigate: redirect component om gebruiker door te sturen
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  // isLoggedIn: boolean state om te controleren of de gebruiker is ingelogd
  // Dit wordt initieel gecheckt via localStorage token (true als token bestaat)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // username state om de gebruikersnaam op te slaan, die we tonen en meegeven aan pagina's
  const [username, setUsername] = useState("");

  // useEffect wordt uitgevoerd bij mount én elke keer dat isLoggedIn verandert
  // Haalt de opgeslagen gebruikersnaam uit localStorage en zet die in state
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, [isLoggedIn]);

  return (
    // BrowserRouter zorgt dat routing via URL in browser werkt
    <BrowserRouter>
      {/* Routes bevat alle route-definities */}
      <Routes>
        {/* Home route ("/") - alleen toegankelijk als ingelogd */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              // Als ingelogd, render Home component met username en setIsLoggedIn als prop
              <Home username={username} setIsLoggedIn={setIsLoggedIn} />
            ) : (
              // Anders doorverwijzen naar login pagina
              <Navigate to="/login" />
            )
          }
        />

        {/* Login route */}
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              // Alleen tonen als NIET ingelogd, anders doorverwijzen naar home
              <Login />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Register route */}
        <Route
          path="/register"
          element={
            !isLoggedIn ? (
              // Alleen tonen als NIET ingelogd, anders doorverwijzen naar home
              <Register />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Profile route - alleen toegankelijk als ingelogd */}
        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              // Profile component krijgt username als prop
              <Profile username={username} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

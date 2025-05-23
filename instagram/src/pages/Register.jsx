// --- src/pages/Register.js ---
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const register = async () => {
    await api.post("/auth/register", { username, password });
    nav("/login");
  };

  return (
    <div>
      <h2>Registreren</h2>
      <input
        placeholder="Gebruikersnaam"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Wachtwoord"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Registreer</button>
    </div>
  );
}

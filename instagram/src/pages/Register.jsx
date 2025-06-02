import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/auth/register", {
        username,
        password,
      });
      alert("Registratie gelukt!");
    } catch (err) {
      console.error(err);
      alert("Registratie mislukt");
    }
  };

  return (
    <form onSubmit={register}>
      <h2>Register</h2>
      <input
        placeholder="Gebruikersnaam"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Registreer</button>
    </form>
  );
};

export default Register;

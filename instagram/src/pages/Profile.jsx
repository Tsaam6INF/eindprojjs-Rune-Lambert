// --- src/pages/Profile.js ---
export default function Profile({ user }) {
  return (
    <div>
      <h1>Jouw profiel</h1>
      {user ? <p>Gebruikersnaam: {user.username}</p> : <p>Niet ingelogd</p>}
    </div>
  );
}

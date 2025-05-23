// --- src/pages/Home.js ---
export default function Home({ user }) {
  return (
    <div>
      <h1>Welkom op Instagram {user?.username}!</h1>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // Update state: uitloggen
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", background: "#eee", marginBottom: "1rem" }}>
      <button onClick={handleLogout}>Log uit</button>
    </nav>
  );
}

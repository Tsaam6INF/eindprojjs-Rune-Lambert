import React from "react";
import Navbar from "./components/Navbar"; // Zorg ervoor dat je de juiste import hebt
import Stories from "./components/Stories";
import Feed from "./components/Feed";

const App = () => {
  return (
    <div className="app">
      <Navbar /> {/* Navbar bovenaan */}
      <Stories /> {/* Stories onder de navbar */}
      <Feed /> {/* Feed onder de stories */}
    </div>
  );
};

export default App;

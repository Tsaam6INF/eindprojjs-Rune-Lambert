import React from "react";
import Navbar from "./components/Navbar";
import Feed from "./components/Feed";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Feed />
    </div>
  );
}

export default App;

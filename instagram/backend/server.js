const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

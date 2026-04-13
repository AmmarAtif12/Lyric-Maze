const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const lyricsRoutes = require("./routes/lyrics");
const scoresRoutes = require("./routes/scores");
const usersRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// Logging
app.use(morgan("dev"));

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lyrics", lyricsRoutes);
app.use("/api/scores", scoresRoutes);
app.use("/api/users", usersRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

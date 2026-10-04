import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import contentRoutes from "./routes/content.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import contactRoutes from "./routes/contact.js";

const app = express();

/**
 * Security middleware
 */
app.use(helmet());

/**
 * CORS
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
      : true,
    credentials: true,
  }),
);

/**
 * Body parser
 */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * Logging
 */
app.use(morgan("dev"));

/**
 * Health check
 */
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "water-house-api",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
app.use("/api/content", contentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

/**
 * Server config
 *
 * Port 5000 is occupied by macOS Control Center / AirPlay,
 * so Water House uses 5001 locally.
 */
const PORT = Number(process.env.PORT) || 5001;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing from environment variables.");
  process.exit(1);
}

/**
 * Start server
 */
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Water House API running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start Water House API:");
    console.error(error);
    process.exit(1);
  }
}

startServer();

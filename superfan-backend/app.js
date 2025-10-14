// app.js
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";

import authRoutes from "./routes/auth.js";
import adminGatedRoutes from "./routes/adminGatedContentRoutes.js"; // admin-facing
import userGatedRoutes from "./routes/userGatedContentRoutes.js";   // user-facing
import nftRoutes from "./routes/nftRoutes.js";
import governanceRoutes from "./routes/governanceRoutes.js";
import "./config/passport.js"; // initialize passport strategies

import requireAuth from "./middleware/requireAuth.js";
import requireAdmin from "./middleware/requireAdmin.js";

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(morgan("dev"));
app.use(express.json());

// ===== Dynamic CORS =====
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST tools like Postman (no origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(passport.initialize());

// ===== Health check =====
app.get("/", (req, res) => res.send("✅ SuperfanVerified Backend Running"));

// ===== Auth Routes =====
app.use("/auth", authRoutes);

// ===== Admin Gated Content Routes =====
app.use("/admin/gated", requireAuth, requireAdmin, adminGatedRoutes);

// ===== User-Facing Gated Content Routes =====
app.use("/gated", requireAuth, userGatedRoutes);

// ===== NFT Routes =====
app.use("/api/nft", requireAuth, nftRoutes);

// ===== Governance Routes =====
app.use("/api/governance", governanceRoutes);

// ===== Fallback for unknown routes =====
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ===== Export the app for the serverless handler =====
export default app;

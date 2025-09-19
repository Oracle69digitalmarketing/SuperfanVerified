// app.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";

import authRoutes from "./routes/auth.js";
import gatedRoutes from "./routes/gatedContent.js"; // new gated content routes
import "./config/passport.js"; // initialize strategies
import { requireFanTier, requireVerification } from "./middleware/auth.js"; // custom middleware

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(passport.initialize());

// ===== Health check =====
app.get("/", (req, res) => res.send("✅ SuperfanVerified Backend Running"));

// ===== Auth Routes =====
app.use("/auth", authRoutes);

// ===== Gated Content Routes =====
// Example: only allow users with Silver+ tier and verified XION Dave to access
app.use(
  "/gated",
  requireVerification("xionDaveVerified"), // must have XION Dave verification
  requireFanTier("Silver"), // must be Silver or higher
  gatedRoutes
);

// ===== Fallback for unknown routes =====
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ===== Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log("Auth routes ready at:");
  console.log("  /auth/spotify");
  console.log("  /auth/google");
  console.log("  /auth/facebook");
  console.log("  /auth/twitter");
  console.log("Gated content routes ready at:");
  console.log("  /gated/*");
});

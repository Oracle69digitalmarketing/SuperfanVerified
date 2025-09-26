// app.js
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";

import authRoutes from "./routes/auth.js";
import adminGatedRoutes from "./routes/adminGatedContentRoutes.js"; // admin-facing
import userGatedRoutes from "./routes/userGatedContentRoutes.js";   // user-facing
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

// ===== Fallback for unknown routes =====
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ===== Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("Allowed CORS origins:", allowedOrigins);
  console.log("Auth routes ready at:");
  console.log("  /auth/spotify");
  console.log("  /auth/google");
  console.log("  /auth/facebook");
  console.log("  /auth/twitter");
  console.log("Admin gated content routes ready at:");
  console.log("  /admin/gated/*");
  console.log("User-facing gated content routes ready at:");
  console.log("  /gated/*");
});

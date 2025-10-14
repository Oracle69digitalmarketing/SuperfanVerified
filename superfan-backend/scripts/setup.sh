#!/bin/bash
set -e
echo "⚡ Setting up Superfan backend with Express + PostgreSQL..."

# -------------------------------
# package.json
# -------------------------------
cat > package.json <<'EOT'
{
  "name": "superfan-backend",
  "version": "1.0.0",
  "description": "Superfan Verified backend (Express + PostgreSQL)",
  "main": "app.js",
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "dev": "NODE_ENV=development nodemon app.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "mongoose": "^7.6.0",
    "express-session": "^1.17.3",
    "passport": "^0.6.0",
    "connect-mongo": "^5.0.0",
    "redis": "^5.2.0",
    "morgan": "^1.10.0",
    "helmet": "^7.0.0"
  }
}
EOT

# -------------------------------
# app.js
# -------------------------------
cat > app.js <<'EOT'
import express from "express";
import session from "express-session";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ===== Security + CORS + JSON parsing =====
app.use(helmet());
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : '*';
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(express.json());
app.use(morgan('dev'));

// ===== DB CONNECT =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error", err));

// ===== SESSION =====
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// ===== PASSPORT =====
app.use(passport.initialize());
app.use(passport.session());

// ===== ROUTES =====
app.use("/auth", authRoutes);
app.get("/", (req, res) => res.send("Home"));
app.get("/dashboard", (req, res) => {
  if (!req.user) return res.redirect("/login");
  res.send(`
    <h1>Dashboard</h1>
    <p>Provider: ${req.user.provider}</p>
    <p>Name: ${req.user.displayName}</p>
    <p>Email: ${req.user.email || "N/A"}</p>
  `);
});
app.get("/login", (req, res) => res.send("Login failed"));

// ===== Optional Redis + zkTLS readiness checks (non-blocking) =====
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.warn('⚠️ Redis Client Error:', err));

redisClient.connect()
  .then(() => console.log("✅ Redis connected"))
  .catch(() => console.warn("⚠️ Redis not connected. Skipping, optional."));

if (process.env.ZKTLS_API_URL) {
  try {
    const zkResponse = await fetch(`${process.env.ZKTLS_API_URL}/health`);
    if (zkResponse.status === 200) console.log("✅ zkTLS endpoint reachable");
    else console.warn("⚠️ zkTLS endpoint not reachable");
  } catch {
    console.warn("⚠️ zkTLS endpoint check failed. Skipping, optional.");
  }
} else {
  console.log("ℹ️ ZKTLS_API_URL not set. Skipping zkTLS check.");
}

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Superfan backend running on http://localhost:${PORT}`));
EOT

# -------------------------------
# .env
# -------------------------------
cat > .env <<'EOT'
# Server
PORT=3000
NODE_ENV=production
SESSION_SECRET=your_session_secret_here

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/superfan

# PostgreSQL (optional)
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=superfan

# Frontend + CORS
FRONTEND_URL=https://app.yourdomain.com
CORS_ORIGINS=https://your-preview.expo.app,https://your-prod.expo.app

# zkTLS
ZKTLS_API_URL=https://your-zktls-verifier.com/api
ZKTLS_API_KEY=sk_live_xxxxx

# Spotify (example external provider)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
EOT

echo "✅ Backend + .env + optional services checks ready!"
echo "👉 Next steps:"
echo "1. npm install"
echo "2. Make sure PostgreSQL & MongoDB are running"
echo "3. npm run dev"

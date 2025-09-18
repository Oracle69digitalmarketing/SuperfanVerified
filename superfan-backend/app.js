<<<<<<< HEAD
// app.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
=======
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
>>>>>>> b0d8182 (update dockerfiles and backend)

import authRoutes from "./routes/auth.js";
import "./config/passport.js"; // initialize strategies

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(passport.initialize());

// ===== Routes =====
app.get("/", (req, res) => res.send("✅ SuperfanVerified Backend Running"));

app.use("/auth", authRoutes);

// fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

<<<<<<< HEAD
// ===== Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`Auth routes ready at:`);
  console.log(`  /auth/spotify`);
  console.log(`  /auth/google`);
  console.log(`  /auth/facebook`);
  console.log(`  /auth/twitter`);
=======
// 🚀 API routes
app.use('/users', userRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/scan', scanRoutes);
app.use('/activity', activityRoutes);
app.use('/referrals', referralRoutes);

// ❌ Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 🧨 Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// 🟢 Start server (with DB connection)
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Superfan backend running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
>>>>>>> b0d8182 (update dockerfiles and backend)
});

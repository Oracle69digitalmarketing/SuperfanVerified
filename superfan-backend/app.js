require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./utils/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const scanRoutes = require('./routes/scanRoutes');

const app = express();

// CORS setup
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : '*';

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  })
);

// JSON parsing
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// API routes
app.use('/users', userRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/scan', scanRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Superfan backend running on port ${PORT}`);
});

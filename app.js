require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const pool = require('./utils/db');

// Route modules
const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const scanRoutes = require('./routes/scanRoutes');
const activityRoutes = require('./routes/activityRoutes');
const referralRoutes = require('./routes/referralRoutes');

const app = express();

// 🛡️ Security headers
app.use(helmet());

// 🌍 CORS setup
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : '*';

app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));

// 🧠 JSON parsing
app.use(express.json());

// 📋 Request logging
app.use(morgan('dev'));

// 🩺 Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

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
process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...');
  pool.end(() => {
    console.log('✅ PostgreSQL pool closed');
    process.exit(0);
  });
});

// 🟢 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Superfan backend running on port ${PORT}`);
});

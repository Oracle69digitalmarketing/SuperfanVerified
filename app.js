require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

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
});

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

// Route modules (must be ES modules with .js extension)
import userRoutes from './routes/userRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import referralRoutes from './routes/referralRoutes.js';

dotenv.config();

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

// 🟢 Start server after MongoDB connects
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Superfan backend running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

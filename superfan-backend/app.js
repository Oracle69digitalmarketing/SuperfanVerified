import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
// import { createClient } from 'redis'; // 🔒 Redis disabled

// Route modules
import userRoutes from './routes/userRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import spotifyRoutes from './routes/spotify.js'; // 🆕 zkTLS route added

dotenv.config();

const app = express();

app.use(express.static('public'));

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

// 🔒 Redis setup disabled
/*
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
}
connectRedis();
*/

// 🔒 Redis test route disabled
/*
app.get('/api/cache-test', async (req, res) => {
  await redisClient.set('greeting', 'Hello Prince');
  const value = await redisClient.get('greeting');
  res.send({ message: value });
});
*/

// 🩺 Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// 🚀 API routes
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes); // 🆕 Now includes /submit-score and /superfan-top
app.use('/api/scans', scanRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/spotify', spotifyRoutes); // 🆕 zkTLS proof route

// ❌ Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 🟢 Start server after MongoDB connects
const PORT = process.env.PORT || 5000;

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

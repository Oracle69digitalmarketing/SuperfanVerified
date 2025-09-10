import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createClient } from 'redis';

import userRoutes from './routes/userRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import activityRoutes from './routes/activityRoutes.js'; // ✅ Added

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Redis setup
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

// ✅ Register routes
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/activities', activityRoutes); // ✅ Registered

// ✅ Redis test route
app.get('/api/cache-test', async (req, res) => {
  await redisClient.set('greeting', 'Hello Prince');
  const value = await redisClient.get('greeting');
  res.send({ message: value });
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

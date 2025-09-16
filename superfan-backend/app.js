import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from './config/passport.js';
import MongoStore from 'connect-mongo';
import fs from 'fs';
import path from 'path';

// import { createClient } from 'redis'; // 🔒 Redis disabled

// Route modules
import userRoutes from './routes/userRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import spotifyRoutes from './routes/spotify.js';
import authRoutes from './routes/auth.js';
import tokenRoutes from './routes/token.js';
import zktlsRoutes from './routes/zktls.js';
import proofRoutes from './routes/proof.js';
import gatedContentRoutes from './routes/gatedContentRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
dotenv.config();

const app = express();

// 📂 Static assets
app.use(express.static('public'));

// 🛡️ Security headers
app.use(helmet());

// 🌍 CORS
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : '*';
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));

// 🧠 JSON parsing
app.use(express.json());

// 📋 Logging
app.use(morgan('dev'));

// 🔹 Console + file logger
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const logFile = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const userInfo = req.user ? ` | 👤 ${req.user.email || req.user.username || req.user.id}` : '';
    const logMsg = `📥 ${req.method} ${req.originalUrl} → ${res.statusCode} [${duration}ms]${userInfo}`;
    if (process.env.NODE_ENV === 'production') logFile.write(`${new Date().toISOString()} ${logMsg}\n`);
    else console.log(logMsg);
  });
  next();
});

// 🔒 Redis disabled
/*
const redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
(async () => { await redisClient.connect(); console.log('✅ Redis connected'); })();
*/

// ===== SESSION + PASSPORT =====
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));
app.use(passport.initialize());
app.use(passport.session());

// 🩺 Health
app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// 🚀 API routes
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/zktls', zktlsRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/proof', proofRoutes);
app.use('/api/gated-content', gatedContentRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/auth', authRoutes);
app.use('/auth/token', tokenRoutes);

// ===== Pages =====
app.get('/', (_req, res) => res.send('Home'));
app.get('/login', (_req, res) => res.send('Login failed'));
app.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.send(`
    <h1>Dashboard</h1>
    <p>Provider: ${req.user.provider}</p>
    <p>Name: ${req.user.displayName}</p>
    <p>Email: ${req.user.email || "N/A"}</p>
  `);
});

// ❌ Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 🟢 Start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`🚀 Superfan backend running on port ${PORT}`)))
  .catch(err => { console.error('❌ MongoDB connection error:', err); process.exit(1); });

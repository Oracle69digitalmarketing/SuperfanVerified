// backend/routes/leaderboardRoutes.js
import express from 'express';
import {
  getLeaderboard,
  getRedisLeaderboard,
  upsertPlays
} from '../controllers/leaderboardController.js';

const router = express.Router();

// ----------------------------
// GET: Top leaderboard from database
// ----------------------------
router.get('/', getLeaderboard);

// ----------------------------
// GET: Real-time leaderboard from Redis
// ----------------------------
router.get('/redis', getRedisLeaderboard);

// ----------------------------
// POST: Upsert play count for user-artist pair
// ----------------------------
router.post('/plays', upsertPlays);

export default router;

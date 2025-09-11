import express from 'express';
import {
  getLeaderboard,
  getRedisLeaderboard,
  upsertPlays,
  submitSuperfanScore,
  getSuperfanScores
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

// ----------------------------
// POST: Submit zkTLS Superfan Score
// ----------------------------
router.post('/submit-score', submitSuperfanScore);

// ----------------------------
// GET: Top Superfan Scores
// ----------------------------
router.get('/superfan-top', getSuperfanScores);

export default router;

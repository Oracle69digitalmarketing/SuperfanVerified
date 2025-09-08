const express = require('express');
const {
  getLeaderboard,
  getRedisLeaderboard,
  upsertPlays
} = require('../controllers/leaderboardController');

const router = express.Router();

// 🧊 Get top leaderboard from database
router.get('/', getLeaderboard);

// ⚡ Get real-time leaderboard from Redis
router.get('/redis', getRedisLeaderboard);

// 🔁 Upsert play count for a user-artist pair
router.post('/plays', upsertPlays);

module.exports = router;

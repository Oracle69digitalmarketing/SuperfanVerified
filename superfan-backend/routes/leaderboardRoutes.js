const express = require('express');
const { getLeaderboard, upsertPlays } = require('../controllers/leaderboardController');

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.post('/plays', upsertPlays);

module.exports = router;

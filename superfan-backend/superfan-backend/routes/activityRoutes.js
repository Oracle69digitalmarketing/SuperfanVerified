import express from 'express';
import Activity from '../models/Activity.js';
<<<<<<< HEAD:superfan-backend/routes/activityRoutes.js
// import redisClient from '../utils/redisClient.js'; // ❌ Redis removed
=======
import redisClient from '../utils/redisClient.js'; // ✅ Centralized Redis import
>>>>>>> b0d8182 (update dockerfiles and backend):superfan-backend/superfan-backend/routes/activityRoutes.js

const router = express.Router();

// Redis key for global activity leaderboard
const REDIS_LEADERBOARD_KEY = 'leaderboard_activities';

// ----------------------------
// GET all activities
// ----------------------------
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    console.error('Get activities error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------
// POST create a new activity
// ----------------------------
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const activity = new Activity({ name, description });
    await activity.save();

<<<<<<< HEAD:superfan-backend/routes/activityRoutes.js
    // Redis leaderboard logic (disabled)
    /*
=======
    // Initialize in Redis leaderboard
>>>>>>> b0d8182 (update dockerfiles and backend):superfan-backend/superfan-backend/routes/activityRoutes.js
    await redisClient.zAdd(REDIS_LEADERBOARD_KEY, {
      score: 0,
      value: activity._id.toString(),
    });
<<<<<<< HEAD:superfan-backend/routes/activityRoutes.js
    */
=======
>>>>>>> b0d8182 (update dockerfiles and backend):superfan-backend/superfan-backend/routes/activityRoutes.js

    res.status(201).json(activity);
  } catch (err) {
    console.error('Create activity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------
// POST increment activity score
// ----------------------------
router.post('/:id/score', async (req, res) => {
  try {
    const { increment = 1 } = req.body;

<<<<<<< HEAD:superfan-backend/routes/activityRoutes.js
    // Redis score increment logic (disabled)
    /*
=======
>>>>>>> b0d8182 (update dockerfiles and backend):superfan-backend/superfan-backend/routes/activityRoutes.js
    const newScore = await redisClient.zIncrBy(
      REDIS_LEADERBOARD_KEY,
      increment,
      req.params.id
    );
<<<<<<< HEAD:superfan-backend/routes/activityRoutes.js
    res.json({ activityId: req.params.id, newScore });
    */

    res.json({ activityId: req.params.id, newScore: `+${increment}` });
=======

    res.json({ activityId: req.params.id, newScore });
>>>>>>> b0d8182 (update dockerfiles and backend):superfan-backend/superfan-backend/routes/activityRoutes.js
  } catch (err) {
    console.error('Increment activity score error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------
// GET top activities leaderboard
// ----------------------------
router.get('/leaderboard', async (req, res) => {
  try {
<<<<<<< HEAD:superfan-backend/routes/activityRoutes.js
    // Redis leaderboard fetch logic (disabled)
    /*
=======
>>>>>>> b0d8182 (update dockerfiles and backend):superfan-backend/superfan-backend/routes/activityRoutes.js
    const topActivities = await redisClient.zRangeWithScores(
      REDIS_LEADERBOARD_KEY,
      0,
      -1,
      { REV: true }
    );
    res.json(topActivities);
<<<<<<< HEAD:superfan-backend/routes/activityRoutes.js
    */

    res.json({ message: 'Leaderboard temporarily disabled (Redis removed)' });
=======
>>>>>>> b0d8182 (update dockerfiles and backend):superfan-backend/superfan-backend/routes/activityRoutes.js
  } catch (err) {
    console.error('Get leaderboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

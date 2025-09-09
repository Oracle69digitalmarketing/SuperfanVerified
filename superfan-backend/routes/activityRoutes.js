// backend/routes/activityRoutes.js
import express from 'express';
import Activity from '../models/Activity.js';
import redis from 'redis';

const router = express.Router();

// Connect to Redis
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});
client.connect().catch(err => console.error('Redis connection error:', err));

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

    // Initialize in Redis leaderboard
    await client.zAdd(REDIS_LEADERBOARD_KEY, {
      score: 0,
      value: activity._id.toString(),
    });

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

    const newScore = await client.zIncrBy(
      REDIS_LEADERBOARD_KEY,
      increment,
      req.params.id
    );

    res.json({ activityId: req.params.id, newScore });
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
    const topActivities = await client.zRangeWithScores(
      REDIS_LEADERBOARD_KEY,
      0,
      -1,
      { REV: true }
    );
    res.json(topActivities);
  } catch (err) {
    console.error('Get leaderboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

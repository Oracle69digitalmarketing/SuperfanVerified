import mongoose from 'mongoose';
import redis from 'redis';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import PlayEvent from '../models/PlayEvent.js';

// ⚡ Redis client
const client = redis.createClient();
await client.connect();

// 🚀 Log a fan activity and award points
const logActivity = async (req, res) => {
  try {
    const { userId, actionType, points = 0, source = 'unknown' } = req.body;

    if (!userId || !actionType) {
      return res.status(400).json({ error: 'userId and actionType are required' });
    }

    // 🧾 Save activity record in MongoDB
    const activity = await Activity.create({
      userId,
      type: actionType,
      points,
      metadata: { source },
    });

    // 🔁 Update user points
    await User.findByIdAndUpdate(userId, { $inc: { points } });

    // 📊 Log play event for analytics
    await PlayEvent.create({
      userId,
      artist: actionType,
      delta: points,
      source,
    });

    // 🧊 Invalidate leaderboard cache
    await client.del('leaderboard_top_100');

    // ⚡ Update Redis leaderboard
    await client.zIncrBy('leaderboard_global', points, userId.toString());

    res.json({
      activity,
      message: `${points} points awarded for ${actionType}`,
    });
  } catch (err) {
    console.error('logActivity error:', err);
    res.status(500).json({ error: 'Failed to log activity' });
  }
};

// 📜 List recent fan activities
const listActivities = async (_req, res) => {
  try {
    const activities = await Activity.find()
      .populate('userId', 'wallet_address name')
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(activities);
  } catch (err) {
    console.error('listActivities error:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

// ✅ Export default controller object
export default {
  logActivity,
  listActivities,
};

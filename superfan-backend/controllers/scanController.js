import Scan from '../models/Scan.js';
import User from '../models/User.js';
import redis from 'redis';

const client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
client.connect().catch(console.error);

// 🧾 Add Scan
export const addScan = async (req, res) => {
  try {
    const { userId, artist } = req.body;
    if (!userId || !artist) {
      return res.status(400).json({ error: 'userId and artist required' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const source = req.headers['x-source'] || 'unknown';

    // 1. Insert Scan record
    const scan = new Scan({ userId, artist, source });
    await scan.save();

    // 2. Update User's play/scan count
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Upsert leaderboard metric: we'll use fanStreak.current as proxy
    user.fanStreak.current += 1;

    // 3. Update streaks
    const lastScan = user.fanStreak.lastScanDate
      ? new Date(user.fanStreak.lastScanDate).toISOString().slice(0, 10)
      : null;

    if (lastScan) {
      const diff =
        (new Date(today) - new Date(lastScan)) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        user.fanStreak.current += 1;
        user.fanStreak.longest = Math.max(user.fanStreak.current, user.fanStreak.longest);
      } else if (diff > 1) {
        user.fanStreak.current = 1;
      }
    } else {
      user.fanStreak.current = 1;
      user.fanStreak.longest = 1;
    }

    user.fanStreak.lastScanDate = today;

    // 4. Update Fan Tier
    const totalScans = await Scan.countDocuments({ userId });
    const longestStreak = user.fanStreak.longest || 0;

    let tier = 'Bronze';
    if (totalScans >= 50 && longestStreak >= 7) tier = 'Silver';
    if (totalScans >= 200 && longestStreak >= 14) tier = 'Gold';
    if (totalScans >= 500 && longestStreak >= 30) tier = 'Legend';

    user.fanTier = tier;
    await user.save();

    // 5. Redis: invalidate + sync
    await client.del('leaderboard_top_100');
    await client.zIncrBy('leaderboard_global', 1, user._id.toString());

    res.json({
      scan,
      leaderboard: {
        userId: user._id.toString(),
        totalPlays: user.fanStreak.current,
      },
      tier,
    });
  } catch (err) {
    console.error('addScan error:', err);
    res.status(500).json({ error: 'addScan failed' });
  }
};

// 📋 List recent scans
export const listScans = async (_req, res) => {
  try {
    const scans = await Scan.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('userId', 'wallet_address name');

    const formatted = scans.map(s => ({
      id: s._id,
      userId: s.userId._id,
      wallet_address: s.userId.wallet_address,
      name: s.userId.name,
      artist: s.artist,
      createdAt: s.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('listScans error:', err);
    res.status(500).json({ error: 'listScans failed' });
  }
};

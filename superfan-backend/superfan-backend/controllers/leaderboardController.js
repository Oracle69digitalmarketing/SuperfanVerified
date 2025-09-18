import User from '../models/User.js';
// import redis from 'redis'; // 🔒 Redis disabled

// const client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
// client.connect().catch(console.error);

// 🔐 Get top leaderboard from MongoDB + optional Redis cache
export const getLeaderboard = async (_req, res) => {
  try {
    // const cacheKey = 'leaderboard_top_100';
    // const cached = await client.get(cacheKey);
    // if (cached) return res.json(JSON.parse(cached));

    const users = await User.find()
      .sort({ 'fanStreak.current': -1, createdAt: -1 })
      .limit(100)
      .select('wallet_address name fanStreak');

    const formatted = users.map(u => ({
      userId: u._id.toString(),
      walletAddress: u.wallet_address,
      name: u.name,
      totalPlays: u.fanStreak.current,
    }));

    // await client.set(cacheKey, JSON.stringify(formatted), { EX: 30 }); // cache 30s
    res.json(formatted);
  } catch (err) {
    console.error('getLeaderboard error:', err);
    res.status(500).json({ error: 'getLeaderboard failed' });
  }
};

// 🔁 Upsert plays / increment fan streak + sync Redis leaderboard
export const upsertPlays = async (req, res) => {
  try {
    const { userId, delta } = req.body;
    if (!userId || !Number.isInteger(delta))
      return res.status(400).json({ error: 'userId and integer delta required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.fanStreak.current = Math.max(0, user.fanStreak.current + delta);
    user.fanStreak.longest = Math.max(user.fanStreak.current, user.fanStreak.longest);
    await user.save();

    // await client.del('leaderboard_top_100');
    // await client.zIncrBy('leaderboard_global', delta, user._id.toString());

    res.json({
      userId: user._id.toString(),
      totalPlays: user.fanStreak.current,
    });
  } catch (err) {
    console.error('upsertPlays error:', err);
    res.status(500).json({ error: 'upsertPlays failed' });
  }
};

// 🧠 Get Redis leaderboard snapshot
export const getRedisLeaderboard = async (_req, res) => {
  try {
    // const top = await client.zRangeWithScores('leaderboard_global', 0, 99, { REV: true });
    // const formatted = top.map(item => ({
    //   userId: item.value,
    //   totalPlays: item.score,
    // }));
    // res.json(formatted);

    res.status(501).json({ error: 'Redis leaderboard disabled' });
  } catch (err) {
    console.error('getRedisLeaderboard error:', err);
    res.status(500).json({ error: 'getRedisLeaderboard failed' });
  }
};

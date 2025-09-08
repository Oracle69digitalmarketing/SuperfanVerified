const pool = require('../db');
const redis = require('redis');
const client = redis.createClient();

client.connect();

// 🧊 GET Leaderboard with Redis Cache
exports.getLeaderboard = async (_req, res) => {
  try {
    const cacheKey = 'leaderboard_top_100';
    const cached = await client.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const { rows } = await pool.query(
      `SELECT l.user_id, u.wallet_address, u.name, l.artist, l.total_plays, l.updated_at
       FROM leaderboard l
       JOIN users u ON u.id = l.user_id
       ORDER BY l.total_plays DESC, l.updated_at DESC
       LIMIT 100;`
    );

    await client.set(cacheKey, JSON.stringify(rows), { EX: 30 }); // cache for 30s
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'getLeaderboard failed' });
  }
};

// 🔁 UPSERT Plays + Log Event + Redis Leaderboard Sync
exports.upsertPlays = async (req, res) => {
  try {
    const { userId, artist, delta } = req.body;
    if (!userId || !artist || !Number.isInteger(delta))
      return res.status(400).json({ error: 'userId, artist, integer delta required' });

    // Update DB leaderboard
    const q = `
      INSERT INTO leaderboard (user_id, artist, total_plays, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, artist) DO UPDATE
      SET total_plays = GREATEST(0, leaderboard.total_plays + EXCLUDED.total_plays),
          updated_at = NOW()
      RETURNING user_id, artist, total_plays, updated_at;
    `;
    const { rows } = await pool.query(q, [userId, artist, delta]);

    // Log play event for analytics
    await pool.query(
      `INSERT INTO play_events (user_id, artist, delta, source)
       VALUES ($1, $2, $3, $4)`,
      [userId, artist, delta, req.headers['x-source'] || 'unknown']
    );

    // Invalidate leaderboard cache
    await client.del('leaderboard_top_100');

    // 🔥 Bonus: Sync Redis leaderboard
    await client.zincrby('leaderboard_global', delta, userId.toString());

    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'upsertPlays failed' });
  }
};

// 🧠 BONUS: Get Redis Leaderboard Snapshot
exports.getRedisLeaderboard = async (_req, res) => {
  try {
    const top = await client.zrevrange('leaderboard_global', 0, 99, 'WITHSCORES');
    const formatted = [];

    for (let i = 0; i < top.length; i += 2) {
      formatted.push({
        userId: top[i],
        totalPlays: parseInt(top[i + 1], 10)
      });
    }

    res.json(formatted);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'getRedisLeaderboard failed' });
  }
};

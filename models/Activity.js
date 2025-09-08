const pool = require('../db');
const redis = require('redis');
const client = redis.createClient();

client.connect();

// 🚀 Log a fan activity and award points
exports.logActivity = async (req, res) => {
  try {
    const { userId, actionType, points = 0, source = 'unknown' } = req.body;

    if (!userId || !actionType) {
      return res.status(400).json({ error: 'userId and actionType are required' });
    }

    // 🧾 Insert activity record
    const insertQuery = `
      INSERT INTO fan_activity (user_id, action_type, points_awarded)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, action_type, points_awarded, timestamp;
    `;
    const result = await pool.query(insertQuery, [userId, actionType, points]);
    const activity = result.rows[0];

    // 🔁 Update user points
    await pool.query(
      `UPDATE users SET points = points + $1 WHERE id = $2`,
      [points, userId]
    );

    // 📊 Log play event for analytics
    await pool.query(
      `INSERT INTO play_events (user_id, artist, delta, source)
       VALUES ($1, $2, $3, $4)`,
      [userId, actionType, points, source]
    );

    // 🧊 Invalidate leaderboard cache
    await client.del('leaderboard_top_100');

    // ⚡ Update Redis leaderboard
    await client.zincrby('leaderboard_global', points, userId.toString());

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
exports.listActivities = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.user_id, u.wallet_address, u.name, a.action_type, a.points_awarded, a.timestamp
       FROM fan_activity a
       JOIN users u ON u.id = a.user_id
       ORDER BY a.timestamp DESC
       LIMIT 200;`
    );
    res.json(rows);
  } catch (err) {
    console.error('listActivities error:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

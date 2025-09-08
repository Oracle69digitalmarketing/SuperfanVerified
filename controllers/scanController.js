const pool = require('../db');
const redis = require('redis');
const client = redis.createClient();

client.connect();

exports.addScan = async (req, res) => {
  try {
    const { userId, artist } = req.body;
    if (!userId || !artist) {
      return res.status(400).json({ error: 'userId and artist required' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const source = req.headers['x-source'] || 'unknown';

    // 🧾 Insert scan record
    const insertScan = `
      INSERT INTO scans (user_id, artist)
      VALUES ($1, $2)
      RETURNING id, user_id, artist, created_at;
    `;
    const scan = await pool.query(insertScan, [userId, artist]);

    // 🔁 Upsert leaderboard entry
    const upsertLeaderboard = `
      INSERT INTO leaderboard (user_id, artist, total_plays, updated_at)
      VALUES ($1, $2, 1, NOW())
      ON CONFLICT (user_id, artist) DO UPDATE
      SET total_plays = leaderboard.total_plays + 1,
          updated_at = NOW()
      RETURNING user_id, artist, total_plays, updated_at;
    `;
    const lb = await pool.query(upsertLeaderboard, [userId, artist]);

    // 📊 Log play event
    await pool.query(
      `INSERT INTO play_events (user_id, artist, delta, source)
       VALUES ($1, $2, $3, $4)`,
      [userId, artist, 1, source]
    );

    // 🔥 Update streaks
    const streakRes = await pool.query(`SELECT * FROM fan_streaks WHERE user_id = $1`, [userId]);
    if (streakRes.rows.length === 0) {
      await pool.query(`
        INSERT INTO fan_streaks (user_id, current_streak, longest_streak, last_scan_date)
        VALUES ($1, 1, 1, $2)
      `, [userId, today]);
    } else {
      const { current_streak, longest_streak, last_scan_date } = streakRes.rows[0];
      const diff = (new Date(today) - new Date(last_scan_date)) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        const newStreak = current_streak + 1;
        const newLongest = Math.max(newStreak, longest_streak);
        await pool.query(`
          UPDATE fan_streaks
          SET current_streak = $1, longest_streak = $2, last_scan_date = $3
          WHERE user_id = $4
        `, [newStreak, newLongest, today, userId]);
      } else if (diff > 1) {
        await pool.query(`
          UPDATE fan_streaks
          SET current_streak = 1, last_scan_date = $1
          WHERE user_id = $2
        `, [today, userId]);
      }
    }

    // 🏆 Assign fan tier
    const totalScansRes = await pool.query(`SELECT COUNT(*) FROM scans WHERE user_id = $1`, [userId]);
    const totalScans = parseInt(totalScansRes.rows[0].count, 10);
    const streakData = await pool.query(`SELECT longest_streak FROM fan_streaks WHERE user_id = $1`, [userId]);
    const longestStreak = streakData.rows[0]?.longest_streak || 0;

    let tier = 'Bronze';
    if (totalScans >= 50 && longestStreak >= 7) tier = 'Silver';
    if (totalScans >= 200 && longestStreak >= 14) tier = 'Gold';
    if (totalScans >= 500 && longestStreak >= 30) tier = 'Legend';

    await pool.query(`
      INSERT INTO fan_tiers (user_id, tier)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE SET tier = $2, updated_at = NOW()
    `, [userId, tier]);

    // 🧊 Invalidate leaderboard cache
    await client.del('leaderboard_top_100');

    // ⚡ Sync Redis leaderboard
    await client.zincrby('leaderboard_global', 1, userId.toString());

    res.json({
      scan: scan.rows[0],
      leaderboard: lb.rows[0],
      tier,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'addScan failed' });
  }
};

exports.listScans = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT s.id, s.user_id, u.wallet_address, u.name, s.artist, s.created_at
       FROM scans s
       JOIN users u ON u.id = s.user_id
       ORDER BY s.created_at DESC
       LIMIT 200;`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'listScans failed' });
  }
};

const pool = require('../db');

exports.getLeaderboard = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT l.user_id, u.wallet_address, u.name, l.artist, l.total_plays, l.updated_at
       FROM leaderboard l
       JOIN users u ON u.id = l.user_id
       ORDER BY l.total_plays DESC, l.updated_at DESC
       LIMIT 100;`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'getLeaderboard failed' });
  }
};

exports.upsertPlays = async (req, res) => {
  try {
    const { userId, artist, delta } = req.body;
    if (!userId || !artist || !Number.isInteger(delta))
      return res.status(400).json({ error: 'userId, artist, integer delta required' });

    const q = `
      INSERT INTO leaderboard (user_id, artist, total_plays, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET artist = EXCLUDED.artist,
          total_plays = GREATEST(0, leaderboard.total_plays + EXCLUDED.total_plays),
          updated_at = NOW()
      RETURNING user_id, artist, total_plays, updated_at;
    `;
    const { rows } = await pool.query(q, [userId, artist, delta]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'upsertPlays failed' });
  }
};

const pool = require('../db');

exports.addScan = async (req, res) => {
  try {
    const { userId, artist } = req.body;
    if (!userId || !artist) return res.status(400).json({ error: 'userId and artist required' });

    const insertScan = `
      INSERT INTO scans (user_id, artist) VALUES ($1, $2)
      RETURNING id, user_id, artist, created_at;
    `;
    const scan = await pool.query(insertScan, [userId, artist]);

    const upsert = `
      INSERT INTO leaderboard (user_id, artist, total_plays, updated_at)
      VALUES ($1, $2, 1, NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET artist = EXCLUDED.artist,
          total_plays = leaderboard.total_plays + 1,
          updated_at = NOW()
      RETURNING user_id, artist, total_plays, updated_at;
    `;
    const lb = await pool.query(upsert, [userId, artist]);

    res.json({ scan: scan.rows[0], leaderboard: lb.rows[0] });
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

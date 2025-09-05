const pool = require('../db');

exports.createUser = async (req, res) => {
  try {
    const { walletAddress, name } = req.body;
    if (!walletAddress) return res.status(400).json({ error: 'walletAddress required' });

    const q = `
      INSERT INTO users (wallet_address, name)
      VALUES ($1, $2)
      ON CONFLICT (wallet_address) DO UPDATE SET name = COALESCE(EXCLUDED.name, users.name)
      RETURNING id, wallet_address, name, created_at;
    `;
    const { rows } = await pool.query(q, [walletAddress, name || null]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'createUser failed' });
  }
};

exports.listUsers = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, wallet_address, name, created_at FROM users ORDER BY created_at DESC LIMIT 200;`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'listUsers failed' });
  }
};

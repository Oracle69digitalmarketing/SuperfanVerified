const pool = require('../db');
const redis = require('redis');
const client = redis.createClient();

client.connect();

// 🔐 Create or update user with referral logic
exports.createUser = async (req, res) => {
  try {
    const { walletAddress, name, referredBy } = req.body;
    if (!walletAddress) return res.status(400).json({ error: 'walletAddress required' });

    // Generate referral code (simple hash or UUID)
    const referralCode = walletAddress.slice(-6).toUpperCase();

    // Insert or update user
    const q = `
      INSERT INTO users (wallet_address, name, referral_code, referred_by)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (wallet_address) DO UPDATE
      SET name = COALESCE(EXCLUDED.name, users.name)
      RETURNING id, wallet_address, name, referral_code, referred_by, created_at;
    `;
    const { rows } = await pool.query(q, [walletAddress, name || null, referralCode, referredBy || null]);
    const user = rows[0];

    // 🧠 Initialize fan streaks
    await pool.query(`
      INSERT INTO fan_streaks (user_id, current_streak, longest_streak, last_scan_date)
      VALUES ($1, 0, 0, NULL)
      ON CONFLICT (user_id) DO NOTHING;
    `, [user.id]);

    // 🏆 Initialize fan tier
    await pool.query(`
      INSERT INTO fan_tiers (user_id, tier)
      VALUES ($1, 'Bronze')
      ON CONFLICT (user_id) DO NOTHING;
    `, [user.id]);

    // 🧊 Sync Redis leaderboard
    await client.zadd('leaderboard_global', { score: 0, value: user.id.toString() });

    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'createUser failed' });
  }
};

// 📋 List recent users
exports.listUsers = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, wallet_address, name, referral_code, referred_by, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT 200;`
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'listUsers failed' });
  }
};

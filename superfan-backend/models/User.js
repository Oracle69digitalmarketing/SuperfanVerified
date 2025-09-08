const pool = require('../db');
const redis = require('redis');
const client = redis.createClient();

client.connect();

// 🧠 Create or fetch user with referral logic
const createUser = async (username, email, referralCode) => {
  const referralCodeGenerated = username.slice(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

  // Check for existing user
  const existing = await pool.query(
    `SELECT * FROM users WHERE email = $1 OR username = $2`,
    [email, username]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  // Insert new user
  const result = await pool.query(
    `INSERT INTO users (username, email, referral_code, referred_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [username, email, referralCodeGenerated, referralCode || null]
  );
  const user = result.rows[0];

  // Initialize fan streaks
  await pool.query(
    `INSERT INTO fan_streaks (user_id, current_streak, longest_streak, last_scan_date)
     VALUES ($1, 0, 0, NULL)`,
    [user.id]
  );

  // Initialize fan tier
  await pool.query(
    `INSERT INTO fan_tiers (user_id, tier)
     VALUES ($1, 'Bronze')`,
    [user.id]
  );

  // Sync Redis leaderboard
  await client.zadd('leaderboard_global', { score: 0, value: user.id.toString() });

  return user;
};

// 📋 Get user by ID
const getUserById = async (id) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
};

// 🔍 Get user by wallet address
const getUserByWallet = async (walletAddress) => {
  const result = await pool.query(`SELECT * FROM users WHERE wallet_address = $1`, [walletAddress]);
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserById,
  getUserByWallet,
};

const pool = require('../db');

const createUser = async (username, email, referralCode) => {
  const newCode = username.slice(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
  const result = await pool.query(
    `INSERT INTO users (username, email, referral_code, referred_by) VALUES ($1, $2, $3, $4) RETURNING *`,
    [username, email, newCode, referralCode || null]
  );
  return result.rows[0];
};

module.exports = { createUser };

const pool = require('../db');

// 🎁 Create a referral reward entry with bonus
exports.createReferralReward = async (req, res) => {
  try {
    const {
      referrerId,
      referredUserId,
      rewardType,
      bonusAmount = 0,
      bonusType = 'points'
    } = req.body;

    if (!referrerId || !referredUserId || !rewardType) {
      return res.status(400).json({ error: 'referrerId, referredUserId, and rewardType are required' });
    }

    const insertQuery = `
      INSERT INTO referral_rewards (
        referrer_id,
        referred_user_id,
        reward_type,
        bonus_amount,
        bonus_type
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { rows } = await pool.query(insertQuery, [
      referrerId,
      referredUserId,
      rewardType,
      bonusAmount,
      bonusType
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error('createReferralReward error:', err);
    res.status(500).json({ error: 'Failed to create referral reward' });
  }
};

// ✅ Update reward status (e.g. pending → claimed)
exports.updateRewardStatus = async (req, res) => {
  try {
    const { rewardId, status } = req.body;
    if (!rewardId || !status) {
      return res.status(400).json({ error: 'rewardId and status are required' });
    }

    const updateQuery = `
      UPDATE referral_rewards
      SET reward_status = $1, timestamp = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(updateQuery, [status, rewardId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('updateRewardStatus error:', err);
    res.status(500).json({ error: 'Failed to update reward status' });
  }
};

// 💸 Update bonus details
exports.updateBonus = async (req, res) => {
  try {
    const { rewardId, bonusAmount, bonusType } = req.body;
    if (!rewardId || bonusAmount == null) {
      return res.status(400).json({ error: 'rewardId and bonusAmount are required' });
    }

    const query = `
      UPDATE referral_rewards
      SET bonus_amount = $1,
          bonus_type = $2,
          timestamp = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [bonusAmount, bonusType || 'points', rewardId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('updateBonus error:', err);
    res.status(500).json({ error: 'Failed to update bonus' });
  }
};

// 📜 List referral rewards for a user
exports.listReferralRewards = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const query = `
      SELECT r.id,
             r.referrer_id,
             ru.name AS referrer_name,
             r.referred_user_id,
             uu.name AS referred_name,
             r.reward_type,
             r.reward_status,
             r.bonus_amount,
             r.bonus_type,
             r.timestamp
      FROM referral_rewards r
      JOIN users ru ON ru.id = r.referrer_id
      JOIN users uu ON uu.id = r.referred_user_id
      WHERE r.referrer_id = $1 OR r.referred_user_id = $1
      ORDER BY r.timestamp DESC
      LIMIT 100;
    `;
    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error('listReferralRewards error:', err);
    res.status(500).json({ error: 'Failed to fetch referral rewards' });
  }
};

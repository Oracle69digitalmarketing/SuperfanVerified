import ReferralReward from '../models/ReferralReward.js';
import User from '../models/User.js';

// 🎁 Create a referral reward entry with bonus
const createReferralReward = async (req, res) => {
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

    const reward = await ReferralReward.create({
      referrerId,
      referredUserId,
      rewardType,
      rewardStatus: 'pending',
      bonusAmount,
      bonusType
    });

    res.json(reward);
  } catch (err) {
    console.error('createReferralReward error:', err);
    res.status(500).json({ error: 'Failed to create referral reward' });
  }
};

// ✅ Update reward status (e.g. pending → claimed)
const updateRewardStatus = async (req, res) => {
  try {
    const { rewardId, status } = req.body;
    if (!rewardId || !status) {
      return res.status(400).json({ error: 'rewardId and status are required' });
    }

    const reward = await ReferralReward.findByIdAndUpdate(
      rewardId,
      { rewardStatus: status },
      { new: true }
    );

    res.json(reward);
  } catch (err) {
    console.error('updateRewardStatus error:', err);
    res.status(500).json({ error: 'Failed to update reward status' });
  }
};

// 💸 Update bonus details
const updateBonus = async (req, res) => {
  try {
    const { rewardId, bonusAmount, bonusType } = req.body;
    if (!rewardId || bonusAmount == null) {
      return res.status(400).json({ error: 'rewardId and bonusAmount are required' });
    }

    const reward = await ReferralReward.findByIdAndUpdate(
      rewardId,
      { bonusAmount, bonusType: bonusType || 'points' },
      { new: true }
    );

    res.json(reward);
  } catch (err) {
    console.error('updateBonus error:', err);
    res.status(500).json({ error: 'Failed to update bonus' });
  }
};

// 📜 List referral rewards for a user
const listReferralRewards = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const rewards = await ReferralReward.find({
      $or: [{ referrerId: userId }, { referredUserId: userId }]
    })
      .populate('referrerId', 'name')
      .populate('referredUserId', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(rewards);
  } catch (err) {
    console.error('listReferralRewards error:', err);
    res.status(500).json({ error: 'Failed to fetch referral rewards' });
  }
};

// ✅ Default export
export default {
  createReferralReward,
  updateRewardStatus,
  updateBonus,
  listReferralRewards,
};

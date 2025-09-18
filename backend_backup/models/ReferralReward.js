// backend/controllers/referralController.js
import ReferralReward from '../models/ReferralReward.js';
import User from '../models/User.js';

// 🎁 Create a referral reward entry with bonus
exports.createReferralReward = async (req, res) => {
  try {
    const { referrerId, referredUserId, rewardType, bonusAmount = 0, bonusType = 'points' } = req.body;

    if (!referrerId || !referredUserId || !rewardType) {
      return res.status(400).json({ error: 'referrerId, referredUserId, and rewardType are required' });
    }

    const reward = new ReferralReward({
      referrer: referrerId,
      referredUser: referredUserId,
      rewardType,
      bonusAmount,
      bonusType,
      rewardStatus: 'pending'
    });

    await reward.save();
    res.status(201).json(reward);
  } catch (err) {
    console.error('createReferralReward error:', err);
    res.status(500).json({ error: 'Failed to create referral reward' });
  }
};

// ✅ Update reward status
exports.updateRewardStatus = async (req, res) => {
  try {
    const { rewardId, status } = req.body;
    if (!rewardId || !status) {
      return res.status(400).json({ error: 'rewardId and status are required' });
    }

    const reward = await ReferralReward.findByIdAndUpdate(
      rewardId,
      { rewardStatus: status, updatedAt: Date.now() },
      { new: true }
    );

    if (!reward) return res.status(404).json({ error: 'Reward not found' });
    res.json(reward);
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

    const reward = await ReferralReward.findByIdAndUpdate(
      rewardId,
      { bonusAmount, bonusType: bonusType || 'points', updatedAt: Date.now() },
      { new: true }
    );

    if (!reward) return res.status(404).json({ error: 'Reward not found' });
    res.json(reward);
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

    const rewards = await ReferralReward.find({
      $or: [{ referrer: userId }, { referredUser: userId }]
    })
      .populate('referrer', 'name')
      .populate('referredUser', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(rewards);
  } catch (err) {
    console.error('listReferralRewards error:', err);
    res.status(500).json({ error: 'Failed to fetch referral rewards' });
  }
};

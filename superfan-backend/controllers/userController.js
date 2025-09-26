// controllers/userController.js
import User from '../models/User.js';

// 🧑 Create or update user with referral logic
export const createUser = async (req, res) => {
  try {
    const { walletAddress, name, referredBy } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: 'walletAddress required' });
    }

    // Check if user exists
    let user = await User.findOne({ wallet_address: walletAddress });

    if (!user) {
      // Generate referral code
      const referralCode = walletAddress.slice(-6).toUpperCase();

      // Find referrer by referral code if provided
      let referrer = null;
      if (referredBy) {
        referrer = await User.findOne({ referralCode: referredBy });
      }

      // Create new user
      user = await User.create({
        name,
        wallet_address: walletAddress,
        referralCode,
        referredBy: referrer?._id || null,
        fanStreak: { current: 0, longest: 0, lastScanDate: null },
        tier: 'Bronze',
      });

      // 🏆 Redis leaderboard sync disabled
    } else {
      // Optional: update name if passed
      if (name) user.name = name;
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error('createUser error:', err);
    res.status(500).json({ error: 'createUser failed' });
  }
};

// 📋 List recent users
export const listUsers = async (_req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .select('wallet_address name referralCode referredBy createdAt');

    res.json(users);
  } catch (err) {
    console.error('listUsers error:', err);
    res.status(500).json({ error: 'listUsers failed' });
  }
};

// 🔑 Passport helper for social login
export const handleUser = async (profile, provider) => {
  try {
    const walletAddress = profile.id;
    const name = profile.displayName || 'Unknown';

    // Check if user exists
    let user = await User.findOne({ wallet_address: walletAddress });
    if (!user) {
      const referralCode = walletAddress.slice(-6).toUpperCase();

      user = await User.create({
        name,
        wallet_address: walletAddress,
        referralCode,
        referredBy: null,
        fanStreak: { current: 0, longest: 0, lastScanDate: null },
        tier: 'Bronze',
      });
    }
    return user;
  } catch (err) {
    console.error(`handleUser error [${provider}]:`, err);
    return null;
  }
};

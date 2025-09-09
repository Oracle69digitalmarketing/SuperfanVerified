import redis from 'redis';
import User from '../models/User.js';
import FanStreak from '../models/FanStreak.js';
import FanTier from '../models/FanTier.js';

// ⚡ Redis client
const client = redis.createClient();
await client.connect();

// 🧠 Create or fetch user with referral logic
const createUser = async (username, email, referralCode) => {
  const referralCodeGenerated = username.slice(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

  // Check for existing user
  let user = await User.findOne({ $or: [{ email }, { name: username }] });
  if (user) return user;

  // Insert new user
  user = await User.create({
    name: username,
    email,
    referralCode: referralCodeGenerated,
    referredBy: referralCode || null,
    points: 0,
  });

  // Initialize fan streaks
  await FanStreak.create({
    userId: user._id,
    currentStreak: 0,
    longestStreak: 0,
    lastScanDate: null,
  });

  // Initialize fan tier
  await FanTier.create({
    userId: user._id,
    tier: 'Bronze',
  });

  // Sync Redis leaderboard
  await client.zAdd('leaderboard_global', { score: 0, value: user._id.toString() });

  return user;
};

// 📋 Get user by ID
const getUserById = async (id) => {
  return await User.findById(id);
};

// 🔍 Get user by wallet address
const getUserByWallet = async (walletAddress) => {
  return await User.findOne({ wallet_address: walletAddress });
};

// ✅ Default export
export default {
  createUser,
  getUserById,
  getUserByWallet,
};

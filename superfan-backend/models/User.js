import mongoose from 'mongoose';
import redis from 'redis';

// -----------------------
// MongoDB User Schema
// -----------------------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  wallet_address: { type: String, unique: true, sparse: true },
  chain_id: Number,
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  fanStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastScanDate: Date,
  },
  tier: { type: String, default: 'Bronze' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// -----------------------
// Redis Leaderboard Setup
// -----------------------
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});
client.connect().catch(console.error);

// -----------------------
// Helper Functions
// -----------------------

// Generate a referral code: first 3 letters of username + 4-digit random
const generateReferralCode = (username) =>
  username.slice(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

// Create a new user with optional referral
export const createUser = async (username, email, referralCode = null) => {
  // Check if user already exists
  const existing = await User.findOne({ $or: [{ email }, { name: username }] });
  if (existing) return existing;

  const referralCodeGenerated = generateReferralCode(username);

  // Find the referrer if referralCode was passed
  let referrer = null;
  if (referralCode) {
    referrer = await User.findOne({ referralCode });
  }

  // Create new user
  const user = await User.create({
    name: username,
    email,
    referralCode: referralCodeGenerated,
    referredBy: referrer?._id || null,
  });

  // Initialize leaderboard score in Redis
  await client.zAdd('leaderboard_global', { score: 0, value: user._id.toString() });

  return user;
};

// Get user by ID
export const getUserById = async (id) => {
  return User.findById(id).exec();
};

// Get user by wallet address
export const getUserByWallet = async (walletAddress) => {
  return User.findOne({ wallet_address: walletAddress }).exec();
};

// Increment fan streak after a check-in
export const updateFanStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const today = new Date();
  const lastScan = user.fanStreak.lastScanDate || new Date(0);
  const diffDays = Math.floor((today - lastScan) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    user.fanStreak.current += 1;
  } else if (diffDays > 1) {
    user.fanStreak.current = 1;
  }

  user.fanStreak.longest = Math.max(user.fanStreak.current, user.fanStreak.longest);
  user.fanStreak.lastScanDate = today;

  await user.save();

  // Optionally update leaderboard score in Redis
  await client.zIncrBy('leaderboard_global', 1, user._id.toString());

  return user;
};

export default User;

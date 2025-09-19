// models/User.js
import mongoose from "mongoose";
import { nanoid } from "nanoid";

const userSchema = new mongoose.Schema(
  {
    // 🔑 Wallet & Identity
    walletAddress: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, trim: true },

    // 👥 Referrals
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // 🧾 Fan streak tracking
    fanStreak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastScanDate: { type: Date, default: null },
    },

    // 🏆 Fan tier assignment
    fanTier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Legend"],
      default: "Bronze",
    },

    // 🎁 Rewards / Gamification
    points: { type: Number, default: 0 },
    rewards: [{ type: String }], // badges, perks, NFTs
    redeemedRewards: [{ type: String }], // track claimed rewards

    // 🌍 Social/Provider Auth
    provider: { type: String },
    providerId: { type: String },
    displayName: String,
    email: String,
    accessToken: String,
    refreshToken: String,
    profile: Object,

    // 🔐 Verification Flags
    xionDaveVerified: { type: Boolean, default: false },
    zktlsVerified: { type: Boolean, default: false },
    daveProofId: { type: String, default: null },
    rumContractAddress: { type: String, default: null }, // optional on-chain proof
  },
  { timestamps: true }
);

// 🧩 Auto-generate referral code
userSchema.pre("save", function (next) {
  if (!this.referralCode) this.referralCode = nanoid(8);
  next();
});

// 🏆 Auto-assign fanTier based on longest streak
userSchema.pre("save", function (next) {
  const streak = this.fanStreak.longest || 0;
  if (streak >= 30) this.fanTier = "Legend";
  else if (streak >= 20) this.fanTier = "Gold";
  else if (streak >= 10) this.fanTier = "Silver";
  else this.fanTier = "Bronze";
  next();
});

// ⚡ Update fan streak
userSchema.statics.updateStreak = async function (userId) {
  const user = await this.findById(userId);
  if (!user) return null;

  const today = new Date();
  const lastScan = user.fanStreak.lastScanDate ? new Date(user.fanStreak.lastScanDate) : null;

  if (lastScan) {
    const diffDays = Math.floor((today - lastScan) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) user.fanStreak.current += 1;
    else if (diffDays > 1) user.fanStreak.current = 1;
  } else {
    user.fanStreak.current = 1;
  }

  if (user.fanStreak.current > user.fanStreak.longest) user.fanStreak.longest = user.fanStreak.current;

  // 🎁 Reward milestones
  if ([7, 14, 30].includes(user.fanStreak.current)) {
    user.points += 50;
    user.rewards.push(`Streak-${user.fanStreak.current}-Day`);
  }

  user.fanStreak.lastScanDate = today;
  await user.save();
  return user;
};

// 🎁 Apply referral bonus
userSchema.statics.applyReferral = async function (userId, referralCode) {
  const user = await this.findById(userId);
  if (!user) return null;

  const referrer = await this.findOne({ referralCode });
  if (!referrer || referrer._id.equals(user._id)) throw new Error("Invalid referral code");

  if (!user.referredBy) {
    user.referredBy = referrer._id;
    await user.save();

    referrer.points += 100;
    referrer.rewards.push("Referral-Bonus");

    user.points += 50;
    user.rewards.push("Welcome-Bonus");

    await referrer.save();
    await user.save();
  }

  return { user, referrer };
};

// 🛍️ Claim reward by spending points
userSchema.statics.claimReward = async function (userId, rewardName, cost) {
  const user = await this.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.points < cost) throw new Error("Insufficient points to claim reward");

  user.points -= cost;
  user.redeemedRewards.push(rewardName);

  await user.save();
  return user;
};

export default mongoose.model("User", userSchema);

// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // 🧾 Fan streak tracking
    fanStreak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastScanDate: { type: Date, default: null },
    },
    // 🏆 Fan tier assignment
    fanTier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Legend'],
      default: 'Bronze',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

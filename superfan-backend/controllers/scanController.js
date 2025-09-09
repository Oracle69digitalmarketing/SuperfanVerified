// controllers/scanController.js
import User from '../models/User.js';
import mongoose from 'mongoose';

// 🧾 Add a new scan + update streaks & tier
export const addScan = async (req, res) => {
  try {
    const { userId, artist } = req.body;
    if (!userId || !artist) {
      return res.status(400).json({ error: 'userId and artist required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date().toISOString().slice(0, 10);
    const lastScanDate = user.fanStreak.lastScanDate
      ? user.fanStreak.lastScanDate.toISOString().slice(0, 10)
      : null;

    // 🔥 Update streaks
    if (!lastScanDate) {
      user.fanStreak.current = 1;
      user.fanStreak.longest = 1;
    } else {
      const diff =
        (new Date(today) - new Date(lastScanDate)) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        // consecutive day
        user.fanStreak.current += 1;
        user.fanStreak.longest = Math.max(
          user.fanStreak.current,
          user.fanStreak.longest
        );
      } else if (diff > 1) {
        // streak broken
        user.fanStreak.current = 1;
      }
    }

    user.fanStreak.lastScanDate = new Date(today);

    // 🏆 Assign tier based on streaks & total scans
    // (for Mongo, let’s just approximate with streaks)
    if (user.fanStreak.longest >= 30) {
      user.fanTier = 'Legend';
    } else if (user.fanStreak.longest >= 14) {
      user.fanTier = 'Gold';
    } else if (user.fanStreak.longest >= 7) {
      user.fanTier = 'Silver';
    } else {
      user.fanTier = 'Bronze';
    }

    await user.save();

    res.json({
      message: 'Scan logged successfully',
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        fanStreak: user.fanStreak,
        fanTier: user.fanTier,
      },
    });
  } catch (e) {
    console.error('❌ addScan failed:', e);
    res.status(500).json({ error: 'addScan failed' });
  }
};

// 📋 Get latest scans (mocked for now, since we didn’t persist scans separately)
export const listScans = async (_req, res) => {
  try {
    // For now, just return users sorted by last scan date
    const users = await User.find()
      .sort({ 'fanStreak.lastScanDate': -1 })
      .limit(200);

    res.json(
      users.map((u) => ({
        id: u._id,
        walletAddress: u.walletAddress,
        name: u.name,
        fanStreak: u.fanStreak,
        fanTier: u.fanTier,
      }))
    );
  } catch (e) {
    console.error('❌ listScans failed:', e);
    res.status(500).json({ error: 'listScans failed' });
  }
};

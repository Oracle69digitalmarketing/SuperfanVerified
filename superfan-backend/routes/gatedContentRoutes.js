import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import GatedContent from "../models/GatedContent.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * GET all gated content for authenticated users
 * - Checks minFanScore + requiredFanTier
 * - Checks XION Dave + ZKTLS verification flags
 * - Grants accessPoints on first unlock
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const contents = await GatedContent.find({});

    const accessible = await Promise.all(
      contents.map(async (content) => {
        const fanTierIndex = ["Bronze", "Silver", "Gold", "Legend"].indexOf(user.fanTier);
        const contentTierIndex = ["Bronze", "Silver", "Gold", "Legend"].indexOf(content.requiredFanTier || "Bronze");

        const meetsScore = user.fanStreak.longest >= (content.minFanScore || 0);
        const meetsTier = fanTierIndex >= contentTierIndex;
        const meetsXion = !content.requireXionDave || user.xionDaveVerified;
        const meetsZktls = !content.requireZKTLS || user.zktlsVerified;

        let unlocked = meetsScore && meetsTier && meetsXion && meetsZktls;

        // Grant access points on first unlock
        if (unlocked && !user.rewards.includes(`Access-${content._id}`)) {
          user.points += content.accessPoints || 0;
          user.rewards.push(`Access-${content._id}`);
          await user.save();
        }

        return {
          _id: content._id,
          title: content.title,
          description: content.description,
          contentUrl: content.contentUrl,
          minFanScore: content.minFanScore || 0,
          requiredFanTier: content.requiredFanTier || "Bronze",
          requireXionDave: content.requireXionDave || false,
          requireZKTLS: content.requireZKTLS || false,
          unlocked,
          accessPoints: content.accessPoints || 0,
        };
      })
    );

    res.json(accessible);
  } catch (err) {
    console.error("Gated content fetch error:", err);
    res.status(500).json({ error: "Failed to load gated content" });
  }
});

export default router;

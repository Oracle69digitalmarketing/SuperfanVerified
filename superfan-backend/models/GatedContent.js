import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import GatedContent from "../models/GatedContent.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * GET gated content
 * - Requires authentication
 * - Checks XION Dave + ZKTLS verification
 * - Checks minFanScore + requiredFanTier
 * - Grants accessPoints on first unlock
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch all gated content
    const contents = await GatedContent.find({});

    const accessible = await Promise.all(
      contents.map(async (content) => {
        let unlocked = false;

        // Fan tier & score check
        if (
          user.fanTier &&
          user.fanStreak.longest >= content.minFanScore &&
          ["Bronze", "Silver", "Gold", "Legend"].indexOf(user.fanTier) >=
            ["Bronze", "Silver", "Gold", "Legend"].indexOf(content.requiredFanTier) &&
          (!content.requireXionDave || user.xionDaveVerified) &&
          (!content.requireZKTLS || user.zktlsVerified)
        ) {
          unlocked = true;

          // grant accessPoints if first unlock
          if (!user.rewards.includes(`Access-${content._id}`)) {
            user.points += content.accessPoints || 0;
            user.rewards.push(`Access-${content._id}`);
            await user.save();
          }
        }

        return {
          _id: content._id,
          title: content.title,
          description: content.description,
          contentUrl: content.contentUrl,
          minFanScore: content.minFanScore,
          requiredFanTier: content.requiredFanTier,
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

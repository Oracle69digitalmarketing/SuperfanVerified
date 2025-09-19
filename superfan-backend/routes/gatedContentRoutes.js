import express from "express";
import passport from "passport";
import User from "../models/User.js";
import GatedContent from "../models/GatedContent.js";

const router = express.Router();

/**
 * GET all gated content (user-aware)
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const contents = await GatedContent.find();

      const accessible = await Promise.all(
        contents.map(async (content) => {
          let unlocked = false;

          if (
            user.fanTier &&
            user.fanStreak.longest >= content.minFanScore &&
            ["Bronze", "Silver", "Gold", "Legend"].indexOf(user.fanTier) >=
              ["Bronze", "Silver", "Gold", "Legend"].indexOf(content.requiredFanTier) &&
            (!content.requireXionDave || user.xionDaveVerified) &&
            (!content.requireZKTLS || user.zktlsVerified)
          ) {
            unlocked = true;

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
            requireXionDave: content.requireXionDave || false,
            requireZKTLS: content.requireZKTLS || false,
          };
        })
      );

      res.json(accessible);
    } catch (err) {
      console.error("Get gated content error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * GET gated content by ID (user-aware)
 */
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const content = await GatedContent.findById(req.params.id);
      if (!content) return res.status(404).json({ error: "Content not found" });

      let unlocked = false;
      if (
        user.fanTier &&
        user.fanStreak.longest >= content.minFanScore &&
        ["Bronze", "Silver", "Gold", "Legend"].indexOf(user.fanTier) >=
          ["Bronze", "Silver", "Gold", "Legend"].indexOf(content.requiredFanTier) &&
        (!content.requireXionDave || user.xionDaveVerified) &&
        (!content.requireZKTLS || user.zktlsVerified)
      ) {
        unlocked = true;
        if (!user.rewards.includes(`Access-${content._id}`)) {
          user.points += content.accessPoints || 0;
          user.rewards.push(`Access-${content._id}`);
          await user.save();
        }
      }

      res.json({
        _id: content._id,
        title: content.title,
        description: content.description,
        contentUrl: content.contentUrl,
        minFanScore: content.minFanScore,
        requiredFanTier: content.requiredFanTier,
        unlocked,
        accessPoints: content.accessPoints || 0,
        requireXionDave: content.requireXionDave || false,
        requireZKTLS: content.requireZKTLS || false,
      });
    } catch (err) {
      console.error("Get gated content by ID error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

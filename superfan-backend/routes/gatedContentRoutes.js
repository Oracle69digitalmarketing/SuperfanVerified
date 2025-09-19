// backend/routes/gatedContentRoutes.js
import express from "express";
import passport from "passport";
import GatedContent from "../models/GatedContent.js";
import User from "../models/User.js";

const router = express.Router();

// ----------------------------
// GET: All gated content (user-aware + verification + rewards)
// ----------------------------
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const contents = await GatedContent.find();

      const accessible = contents.map((content) => {
        let unlocked = false;

        // ✅ Fan score + fan tier + verification check
        const tierOrder = ["Bronze", "Silver", "Gold", "Legend"];
        const contentTierIndex = tierOrder.indexOf(content.requiredFanTier || "Bronze");
        const userTierIndex = tierOrder.indexOf(user.fanTier || "Bronze");

        if (
          user.fanStreak.longest >= content.minFanScore &&
          userTierIndex >= contentTierIndex &&
          (!content.requireXionDave || user.xionDaveVerified) &&
          (!content.requireZKTLS || user.zktlsVerified)
        ) {
          unlocked = true;

          // Grant points if first-time access
          if (!user.rewards.includes(`Access-${content._id}`)) {
            user.points += content.accessPoints || 0;
            user.rewards.push(`Access-${content._id}`);
          }
        }

        return {
          _id: content._id,
          title: content.title,
          description: content.description,
          contentUrl: content.contentUrl,
          minFanScore: content.minFanScore,
          requiredFanTier: content.requiredFanTier || "Bronze",
          requireXionDave: content.requireXionDave || false,
          requireZKTLS: content.requireZKTLS || false,
          unlocked,
          accessPoints: content.accessPoints || 0,
        };
      });

      await user.save();
      res.json(accessible);
    } catch (err) {
      console.error("Get gated content error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ----------------------------
// GET: Gated content by ID (verification-aware)
// ----------------------------
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const content = await GatedContent.findById(req.params.id);
      if (!content) return res.status(404).json({ error: "Content not found" });

      let unlocked = false;
      const tierOrder = ["Bronze", "Silver", "Gold", "Legend"];
      const contentTierIndex = tierOrder.indexOf(content.requiredFanTier || "Bronze");
      const userTierIndex = tierOrder.indexOf(user.fanTier || "Bronze");

      if (
        user.fanStreak.longest >= content.minFanScore &&
        userTierIndex >= contentTierIndex &&
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
        requiredFanTier: content.requiredFanTier || "Bronze",
        requireXionDave: content.requireXionDave || false,
        requireZKTLS: content.requireZKTLS || false,
        unlocked,
        accessPoints: content.accessPoints || 0,
      });
    } catch (err) {
      console.error("Get gated content by ID error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

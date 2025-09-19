// backend/routes/gatedContentRoutes.js
import express from "express";
import GatedContent from "../models/GatedContent.js";
import User from "../models/User.js";
import { requireVerification, requireFanTier } from "../middleware/auth.js";
import passport from "passport";

const router = express.Router();

// ----------------------------
// GET: Gated content by ID (with rewards)
// ----------------------------
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  requireVerification("xionDaveVerified"),
  requireVerification("zktlsVerified"),
  requireFanTier("Silver"),
  async (req, res) => {
    try {
      const content = await GatedContent.findById(req.params.id);
      if (!content)
        return res.status(404).json({ error: "Content not found" });

      if (req.user.points < content.minFanScore) {
        return res.status(403).json({
          error: `Insufficient fan points. Requires at least ${content.minFanScore}`,
        });
      }

      // 🎁 Auto-reward user for accessing gated content
      const rewardName = `Accessed-${content.title}`;
      if (!req.user.rewards.includes(rewardName)) {
        req.user.points += 10; // example: 10 points per content
        req.user.rewards.push(rewardName);
        await req.user.save();
      }

      res.json({
        content,
        reward: {
          name: rewardName,
          pointsEarned: 10,
          totalPoints: req.user.points,
        },
      });
    } catch (err) {
      console.error("Get gated content by ID error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

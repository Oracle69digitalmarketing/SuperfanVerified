// backend/routes/gatedContentRoutes.js
import express from "express";
import GatedContent from "../models/GatedContent.js";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

// ----------------------------
// POST: Create gated content (admin)
// ----------------------------
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Only allow admins (you can adjust your admin check logic)
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const {
        title,
        description,
        minFanScore,
        requiredFanTier,
        contentUrl,
        accessPoints,
      } = req.body;

      if (!title || !description || !minFanScore || !requiredFanTier || !contentUrl) {
        return res.status(400).json({
          error:
            "All fields are required: title, description, minFanScore, requiredFanTier, contentUrl",
        });
      }

      const content = new GatedContent({
        title,
        description,
        minFanScore,
        requiredFanTier,
        contentUrl,
        accessPoints: accessPoints || 0,
      });

      await content.save();
      res.status(201).json(content);
    } catch (err) {
      console.error("Create gated content error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ----------------------------
// GET: All gated content (user + verification aware)
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
        if (
          user.fanTier &&
          user.fanStreak.longest >= content.minFanScore &&
          ["Bronze", "Silver", "Gold", "Legend"].indexOf(user.fanTier) >=
            ["Bronze", "Silver", "Gold", "Legend"].indexOf(content.requiredFanTier) &&
          user.xionDaveVerified &&
          user.zktlsVerified
        ) {
          unlocked = true;

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
          requiredFanTier: content.requiredFanTier,
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
// GET: Gated content by ID (user + verification aware)
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
      if (
        user.fanTier &&
        user.fanStreak.longest >= content.minFanScore &&
        ["Bronze", "Silver", "Gold", "Legend"].indexOf(user.fanTier) >=
          ["Bronze", "Silver", "Gold", "Legend"].indexOf(content.requiredFanTier) &&
        user.xionDaveVerified &&
        user.zktlsVerified
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
      });
    } catch (err) {
      console.error("Get gated content by ID error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

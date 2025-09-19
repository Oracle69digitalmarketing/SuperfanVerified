// routes/userGatedContentRoutes.js
import express from "express";
import GatedContent from "../models/GatedContent.js";

const router = express.Router();

/**
 * User-facing: Access gated content
 * Requires: requireAuth (applied in app.js)
 */

// 📌 Get accessible gated content
router.get("/", async (req, res) => {
  try {
    const { fanTier, points, rewards } = req.user;

    const content = await GatedContent.find({
      $or: [
        { requiredTier: { $lte: fanTier } }, // tier check
        { requiredPoints: { $lte: points } }, // points check
        { requiredRewards: { $in: rewards } }, // reward-based access
      ],
    });

    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get single gated content by ID
router.get("/:id", async (req, res) => {
  try {
    const content = await GatedContent.findById(req.params.id);
    if (!content) return res.status(404).json({ error: "Content not found" });

    // Access check
    const { fanTier, points, rewards } = req.user;
    const hasAccess =
      content.requiredTier <= fanTier ||
      content.requiredPoints <= points ||
      content.requiredRewards.some(r => rewards.includes(r));

    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

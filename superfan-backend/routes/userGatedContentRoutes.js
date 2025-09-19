import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import GatedContent from "../models/GatedContent.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * 📌 GET all gated content accessible to user
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const contents = await GatedContent.find({ isActive: true });

    const accessible = contents.filter((c) => {
      if (user.points < c.requiredPoints) return false;

      const tierOrder = ["Bronze", "Silver", "Gold", "Legend"];
      if (tierOrder.indexOf(user.fanTier) < tierOrder.indexOf(c.requiredTier)) {
        return false;
      }

      if (c.requiredRewards?.length > 0) {
        const hasAll = c.requiredRewards.every((r) => user.rewards.includes(r));
        if (!hasAll) return false;
      }
      return true;
    });

    res.json(accessible);
  } catch (err) {
    console.error("Error loading gated content:", err);
    res.status(500).json({ error: "Failed to load gated content" });
  }
});

/**
 * 📌 GET single gated content by ID
 * - Tracks views
 * - Tracks claim in both content + user
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const content = await GatedContent.findById(req.params.id);

    if (!content || !content.isActive) {
      return res.status(404).json({ error: "Content not found" });
    }

    // Access checks
    if (user.points < content.requiredPoints) {
      return res.status(403).json({ error: "Insufficient points" });
    }

    const tierOrder = ["Bronze", "Silver", "Gold", "Legend"];
    if (
      tierOrder.indexOf(user.fanTier) <
      tierOrder.indexOf(content.requiredTier)
    ) {
      return res.status(403).json({ error: "Tier too low" });
    }

    if (content.requiredRewards?.length > 0) {
      const hasAll = content.requiredRewards.every((r) =>
        user.rewards.includes(r)
      );
      if (!hasAll) {
        return res.status(403).json({ error: "Missing required rewards" });
      }
    }

    // ✅ Track engagement
    content.views += 1;

    if (!content.claimedBy.includes(user._id)) {
      content.claimedBy.push(user._id);
      if (!user.claimedContent.includes(content._id)) {
        user.claimedContent.push(content._id);
      }
      await user.save();
    }

    await content.save();

    res.json(content);
  } catch (err) {
    console.error("Error fetching gated content:", err);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

/**
 * 📌 GET user’s gated content history
 * - Returns only content user has already unlocked/claimed
 */
router.get("/history/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("claimedContent");

    res.json({
      userId: user._id,
      claimed: user.claimedContent || [],
    });
  } catch (err) {
    console.error("Error fetching user history:", err);
    res.status(500).json({ error: "Failed to fetch user history" });
  }
});

export default router;

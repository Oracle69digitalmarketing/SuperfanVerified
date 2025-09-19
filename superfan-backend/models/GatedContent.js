import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireProofs from "../middleware/requireProofs.js";
import GatedContent from "../models/GatedContent.js";

const router = express.Router();

/**
 * GET gated content
 * - Requires authentication
 * - Checks XION Dave + ZKTLS if required
 * - Checks minFanScore
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = req.user;

    // Fetch all gated content
    const contents = await GatedContent.find({});

    // Filter content based on user's status
    const accessible = contents.filter((c) => {
      // Fan score check
      if (user.points < c.minFanScore) return false;

      // Multi-proof check
      if (c.requireXionDave && !user.xionDaveVerified) return false;
      if (c.requireZKTLS && !user.zktlsVerified) return false;

      return true;
    });

    res.json(accessible);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load gated content" });
  }
});

export default router;

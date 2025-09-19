import express from "express";
import GatedContent from "../models/GatedContent.js";

const router = express.Router();

/**
 * POST create new gated content (admin)
 * - title
 * - description
 * - minFanScore
 * - requiredFanTier
 * - contentUrl
 * - accessPoints
 * - requireXionDave
 * - requireZKTLS
 */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      minFanScore = 0,
      requiredFanTier = "Bronze",
      contentUrl,
      accessPoints = 0,
      requireXionDave = false,
      requireZKTLS = false,
    } = req.body;

    if (!title || !description || !contentUrl) {
      return res
        .status(400)
        .json({ error: "title, description, and contentUrl are required" });
    }

    const content = new GatedContent({
      title,
      description,
      minFanScore,
      requiredFanTier,
      contentUrl,
      accessPoints,
      requireXionDave,
      requireZKTLS,
    });

    await content.save();
    res.status(201).json(content);
  } catch (err) {
    console.error("Create gated content error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

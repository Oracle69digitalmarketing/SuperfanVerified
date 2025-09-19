import express from "express";
import GatedContent from "../models/GatedContent.js";

const router = express.Router();

/**
 * POST: Create gated content (admin)
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, minFanScore, contentUrl, requiredFanTier, requireXionDave, requireZKTLS, accessPoints } = req.body;

    if (!title || !description || !contentUrl) {
      return res.status(400).json({ error: "Required fields missing: title, description, contentUrl" });
    }

    const content = new GatedContent({
      title,
      description,
      minFanScore: minFanScore || 0,
      contentUrl,
      requiredFanTier: requiredFanTier || "Bronze",
      requireXionDave: requireXionDave || false,
      requireZKTLS: requireZKTLS || false,
      accessPoints: accessPoints || 0,
    });

    await content.save();
    res.status(201).json(content);
  } catch (err) {
    console.error("Create gated content error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET all gated content (admin)
 */
router.get("/", async (req, res) => {
  try {
    const contents = await GatedContent.find();
    res.json(contents);
  } catch (err) {
    console.error("Get gated content error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET gated content by ID (admin)
 */
router.get("/:id", async (req, res) => {
  try {
    const content = await GatedContent.findById(req.params.id);
    if (!content) return res.status(404).json({ error: "Content not found" });
    res.json(content);
  } catch (err) {
    console.error("Get gated content by ID error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

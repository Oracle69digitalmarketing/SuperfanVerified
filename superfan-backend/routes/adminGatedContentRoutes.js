import express from "express";
import GatedContent from "../models/GatedContent.js";

const router = express.Router();

/**
 * 🔹 GET all gated content (Admin)
 */
router.get("/", async (req, res) => {
  try {
    const contents = await GatedContent.find();
    res.json(contents);
  } catch (err) {
    console.error("Error fetching gated content (admin):", err);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

/**
 * 🔹 POST create new gated content
 */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      contentUrl,
      minFanScore,
      requiredFanTier,
      requireXionDave,
      requireZKTLS,
      accessPoints,
    } = req.body;

    const content = new GatedContent({
      title,
      description,
      contentUrl,
      minFanScore,
      requiredFanTier,
      requireXionDave,
      requireZKTLS,
      accessPoints,
    });

    await content.save();
    res.status(201).json(content);
  } catch (err) {
    console.error("Error creating gated content:", err);
    res.status(500).json({ error: "Failed to create content" });
  }
});

/**
 * 🔹 PUT update gated content
 */
router.put("/:id", async (req, res) => {
  try {
    const content = await GatedContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!content) return res.status(404).json({ error: "Content not found" });
    res.json(content);
  } catch (err) {
    console.error("Error updating gated content:", err);
    res.status(500).json({ error: "Failed to update content" });
  }
});

/**
 * 🔹 DELETE gated content
 */
router.delete("/:id", async (req, res) => {
  try {
    const content = await GatedContent.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ error: "Content not found" });

    res.json({ message: "Content deleted successfully", content });
  } catch (err) {
    console.error("Error deleting gated content:", err);
    res.status(500).json({ error: "Failed to delete content" });
  }
});

export default router;

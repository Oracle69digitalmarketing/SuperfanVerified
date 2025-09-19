// routes/adminGatedContentRoutes.js
import express from "express";
import GatedContent from "../models/GatedContent.js";

const router = express.Router();

/**
 * Admin-facing: Manage gated content
 * Requires: requireAuth + requireAdmin (applied in app.js)
 */

// 📌 Create gated content
router.post("/", async (req, res) => {
  try {
    const content = new GatedContent(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Update gated content
router.put("/:id", async (req, res) => {
  try {
    const updated = await GatedContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Content not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Delete gated content
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await GatedContent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Content not found" });
    res.json({ message: "Content deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 List all gated content
router.get("/", async (req, res) => {
  try {
    const allContent = await GatedContent.find();
    res.json(allContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

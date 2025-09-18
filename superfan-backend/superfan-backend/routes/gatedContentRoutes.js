// backend/routes/gatedContentRoutes.js
import express from 'express';
import GatedContent from '../models/GatedContent.js';

const router = express.Router();

// ----------------------------
// POST: Create gated content (admin)
// ----------------------------
router.post('/', async (req, res) => {
  try {
    const { title, description, minFanScore, contentUrl } = req.body;
    if (!title || !description || !minFanScore || !contentUrl) {
      return res.status(400).json({ error: 'All fields are required: title, description, minFanScore, contentUrl' });
    }

    const content = new GatedContent({ title, description, minFanScore, contentUrl });
    await content.save();
    res.status(201).json(content);
  } catch (err) {
    console.error('Create gated content error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------
// GET: All gated content
// ----------------------------
router.get('/', async (req, res) => {
  try {
    const contents = await GatedContent.find();
    res.json(contents);
  } catch (err) {
    console.error('Get gated content error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------
// GET: Gated content by ID
// ----------------------------
router.get('/:id', async (req, res) => {
  try {
    const content = await GatedContent.findById(req.params.id);
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json(content);
  } catch (err) {
    console.error('Get gated content by ID error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

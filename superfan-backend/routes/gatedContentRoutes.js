import express from 'express';
import GatedContent from '../models/GatedContent.js';

const router = express.Router();

// Create gated content (admin)
router.post('/', async (req, res) => {
  try {
    const { title, description, minFanScore, contentUrl } = req.body;
    const content = new GatedContent({ title, description, minFanScore, contentUrl });
    await content.save();
    res.status(201).json(content);
  } catch (err) {
    console.error('Create gated content error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all gated content
router.get('/', async (req, res) => {
  try {
    const contents = await GatedContent.find();
    res.json(contents);
  } catch (err) {
    console.error('Get gated content error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get gated content by id
router.get('/:id', async (req, res) => {
  try {
    const content = await GatedContent.findById(req.params.id);
    res.json(content);
  } catch (err) {
    console.error('Get gated content by id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

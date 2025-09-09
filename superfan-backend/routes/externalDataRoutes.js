import express from 'express';
import ExternalData from '../models/ExternalData.js';

const router = express.Router();

// Connect external account (mock)
router.post('/connect', async (req, res) => {
  try {
    const { userId, source, data } = req.body;
    const externalData = new ExternalData({ userId, source, data, verified: true });
    await externalData.save();
    res.status(201).json(externalData);
  } catch (err) {
    console.error('Connect external account error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch user external data
router.get('/:userId', async (req, res) => {
  try {
    const data = await ExternalData.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    console.error('Fetch external data error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

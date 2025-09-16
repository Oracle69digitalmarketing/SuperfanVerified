import express from 'express';
import { generateProof } from '../controllers/spotifyController.js';

const router = express.Router();

// POST /spotify/generate-proof
router.post('/generate-proof', async (req, res) => {
  try {
    await generateProof(req, res);
  } catch (err) {
    console.error('Spotify proof error:', err);
    res.status(500).json({ error: 'Proof generation failed' });
  }
});

export default router;

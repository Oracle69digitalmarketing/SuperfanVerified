// routes/proof.js
import express from 'express';
import { generateZKProof, submitToXion } from '../services/zktls.js';

const router = express.Router();

// 🔹 Endpoint to generate a zkTLS proof
router.post('/generate-proof', async (req, res) => {
  const { walletAddress, topArtists, targetArtist } = req.body;

  try {
    const proof = generateZKProof(topArtists, targetArtist);
    const txHash = await submitToXion(proof, walletAddress);

    res.json({ proof, txHash });
  } catch (err) {
    console.error('zkTLS error:', err);
    res.status(500).json({ error: 'Proof generation failed' });
  }
});

export default router;

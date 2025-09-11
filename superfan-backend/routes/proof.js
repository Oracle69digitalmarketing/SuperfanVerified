const express = require('express');
const router = express.Router();
const { generateZKProof, submitToXion } = require('../services/zktls');

router.post('/generate-proof', async (req, res) => {
  const { walletAddress, topArtists, targetArtist } = req.body;

  try {
    const proof = await generateZKProof(topArtists, targetArtist);
    const txHash = await submitToXion(proof, walletAddress);

    res.json({ proof, txHash });
  } catch (err) {
    console.error('zkTLS error:', err);
    res.status(500).json({ error: 'Proof generation failed' });
  }
});

module.exports = router;

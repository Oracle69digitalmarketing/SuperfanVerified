// controllers/spotifyController.js

const generateZKProof = (topArtists, targetArtist) => {
  const valid = topArtists.includes(targetArtist);
  return {
    valid,
    artist: targetArtist,
    zkProof: `zkTLS-${targetArtist}-${Date.now()}`
  };
};

const submitToXion = async (proof, walletAddress) => {
  return `tx_${Math.random().toString(36).slice(2)}`;
};

// ESM export
export const generateProof = async (req, res) => {
  const { walletAddress, topArtists, targetArtist } = req.body;

  try {
    const proof = generateZKProof(topArtists, targetArtist);
    const txHash = await submitToXion(proof, walletAddress);

    res.json({ proof, txHash });
  } catch (error) {
    console.error('zkTLS error:', error);
    res.status(500).json({ error: 'Proof generation failed' });
  }
};

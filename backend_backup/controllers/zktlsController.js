// controllers/zktlsController.js
import axios from 'axios';

const RECLAIM_API_URL = process.env.RECLAIM_API_URL;
const APP_ID = process.env.RECLAIM_APP_ID;
const APP_SECRET = process.env.RECLAIM_APP_SECRET;
const PROVIDER_ID = process.env.RECLAIM_PROVIDER_ID;

// Generate zkTLS proof via Reclaim
export const generateProof = async (req, res) => {
  try {
    const { userId, payload } = req.body;

    if (!userId || !payload) {
      return res.status(400).json({ success: false, message: 'Missing userId or payload' });
    }

    const response = await axios.post(
      `${RECLAIM_API_URL}/proofs/generate`,
      { userId, payload, providerId: PROVIDER_ID },
      { auth: { username: APP_ID, password: APP_SECRET } }
    );

    return res.status(200).json({ success: true, proof: response.data });
  } catch (error) {
    console.error('zkTLS generate error:', error?.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Failed to generate zkTLS proof' });
  }
};

// Verify zkTLS proof via Reclaim
export const verifyProof = async (req, res) => {
  try {
    const { proofId } = req.body;

    if (!proofId) {
      return res.status(400).json({ success: false, message: 'Missing proofId' });
    }

    const response = await axios.post(
      `${RECLAIM_API_URL}/proofs/verify`,
      { proofId },
      { auth: { username: APP_ID, password: APP_SECRET } }
    );

    return res.status(200).json({ success: true, verified: response.data.verified });
  } catch (error) {
    console.error('zkTLS verify error:', error?.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Failed to verify zkTLS proof' });
  }
};

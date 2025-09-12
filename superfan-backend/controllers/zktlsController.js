// controllers/zktlsController.js

import axios from 'axios';

// 🔑 zkTLS Verifier Service URL + API Key (set in .env)
const ZKTLS_API_URL = process.env.ZKTLS_API_URL;   // e.g. "https://verifier.zktls.io"
const ZKTLS_API_KEY = process.env.ZKTLS_API_KEY;   // e.g. "sk_live_xxx"

// 🆕 Generate zkTLS Proof
export const generateProof = async (req, res) => {
  try {
    const { userId, payload } = req.body;

    if (!userId || !payload) {
      return res.status(400).json({ success: false, message: 'Missing userId or payload' });
    }

    const response = await axios.post(
      `${ZKTLS_API_URL}/proofs/generate`,
      { userId, payload },
      { headers: { Authorization: `Bearer ${ZKTLS_API_KEY}` } }
    );

    return res.status(200).json({ success: true, proof: response.data });
  } catch (error) {
    console.error('zkTLS generate error:', error?.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Failed to generate zkTLS proof' });
  }
};

// 🆕 Verify zkTLS Proof
export const verifyProof = async (req, res) => {
  try {
    const { proofId } = req.body;

    if (!proofId) {
      return res.status(400).json({ success: false, message: 'Missing proofId' });
    }

    const response = await axios.post(
      `${ZKTLS_API_URL}/proofs/verify`,
      { proofId },
      { headers: { Authorization: `Bearer ${ZKTLS_API_KEY}` } }
    );

    return res.status(200).json({ success: true, verified: response.data.verified });
  } catch (error) {
    console.error('zkTLS verify error:', error?.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Failed to verify zkTLS proof' });
  }
};

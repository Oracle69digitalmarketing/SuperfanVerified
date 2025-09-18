// services/proofService.js
import axios from 'axios';

const RECLAIM_API_URL = process.env.RECLAIM_API_URL;
const APP_ID = process.env.RECLAIM_APP_ID;
const APP_SECRET = process.env.RECLAIM_APP_SECRET;
const PROVIDER_ID = process.env.RECLAIM_PROVIDER_ID;

/**
 * Generate zkTLS proof for a user
 * @param {Array} topArtists
 * @param {String} targetArtist
 * @returns {Object} proof
 */
export const generateZKProof = async (topArtists, targetArtist) => {
  if (!topArtists || !targetArtist) throw new Error('Missing topArtists or targetArtist');

  try {
    const response = await axios.post(
      `${RECLAIM_API_URL}/proofs/generate`,
      { topArtists, targetArtist, providerId: PROVIDER_ID },
      { auth: { username: APP_ID, password: APP_SECRET } }
    );
    return response.data;
  } catch (err) {
    console.error('generateZKProof error:', err?.response?.data || err.message);
    throw err;
  }
};

/**
 * Submit generated proof to Xion
 * @param {Object} proof
 * @param {String} walletAddress
 * @returns {String} txHash
 */
export const submitToXion = async (proof, walletAddress) => {
  if (!proof || !walletAddress) throw new Error('Missing proof or walletAddress');

  try {
    const response = await axios.post(
      `${RECLAIM_API_URL}/xion/submit`,
      { proof, walletAddress },
      { auth: { username: APP_ID, password: APP_SECRET } }
    );
    return response.data.txHash;
  } catch (err) {
    console.error('submitToXion error:', err?.response?.data || err.message);
    throw err;
  }
};

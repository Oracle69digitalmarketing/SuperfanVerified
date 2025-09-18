import express from 'express';
import { createTokensForUser as createToken, refresh, revoke } from '../controllers/tokenController.js';

const router = express.Router();

// Create a new token
router.post('/', async (req, res) => {
  try {
    const { user } = req.body; // Make sure user object is passed
    const tokens = await createToken(user);
    res.json(tokens);
  } catch (err) {
    console.error('create token error', err);
    res.status(500).json({ error: 'Token creation failed' });
  }
});

// Refresh token
router.post('/refresh', refresh);

// Revoke token
router.post('/revoke', revoke);

export default router;

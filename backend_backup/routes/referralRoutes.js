// backend/routes/referralRoutes.js
import express from 'express';
import Referral from '../models/Referral.js';
import User from '../models/User.js';

const router = express.Router();

// ----------------------------
// POST: Create a referral
// ----------------------------
router.post('/', async (req, res) => {
  try {
    const { referrerId, referredId } = req.body;
    if (!referrerId || !referredId) {
      return res.status(400).json({ error: 'referrerId and referredId are required' });
    }

    const referral = new Referral({ referrerId, referredId });
    await referral.save();

    // Optionally, populate referred user info
    await referral.populate('referredId', 'name email wallet_address');

    res.status(201).json(referral);
  } catch (err) {
    console.error('Referral creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------
// GET: Referrals by referrer
// ----------------------------
router.get('/:userId', async (req, res) => {
  try {
    const referrals = await Referral.find({ referrerId: req.params.userId })
      .populate('referredId', 'name email wallet_address');

    res.json(referrals);
  } catch (err) {
    console.error('Get referrals error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

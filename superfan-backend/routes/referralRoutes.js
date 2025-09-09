import express from 'express';
import Referral from '../models/Referral.js';

const router = express.Router();

// Create a referral
router.post('/', async (req, res) => {
  try {
    const { referrerId, referredId } = req.body;
    const referral = new Referral({ referrerId, referredId });
    await referral.save();
    res.status(201).json(referral);
  } catch (err) {
    console.error('Referral creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get referrals by user
router.get('/:userId', async (req, res) => {
  try {
    const referrals = await Referral.find({ referrerId: req.params.userId }).populate('referredId');
    res.json(referrals);
  } catch (err) {
    console.error('Get referrals error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

// backend/routes/walletRoutes.js
import express from 'express';
import Wallet from '../models/Wallet.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// 🪙 Create wallet
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;
    const address = `0x${nanoid(40)}`; // mock wallet address
    const wallet = new Wallet({ userId, address });
    await wallet.save();
    res.status(201).json(wallet);
  } catch (err) {
    console.error('Wallet creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🔍 Get wallet by user
router.get('/:userId', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    res.json(wallet);
  } catch (err) {
    console.error('Get wallet error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

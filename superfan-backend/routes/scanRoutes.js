// backend/routes/scanRoutes.js
import express from 'express';
import { addScan, listScans } from '../controllers/scanController.js';

const router = express.Router();

// 📥 Log a new scan and update leaderboard
router.post('/', addScan);

// 📋 List recent scans with user info
router.get('/', listScans);

export default router;

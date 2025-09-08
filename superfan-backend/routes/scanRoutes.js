const express = require('express');
const {
  addScan,
  listScans
} = require('../controllers/scanController');

const router = express.Router();

// 📥 Log a new scan and update leaderboard
router.post('/', addScan);

// 📋 List recent scans with user info
router.get('/', listScans);

module.exports = router;

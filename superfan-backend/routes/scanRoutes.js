const express = require('express');
const { addScan, listScans } = require('../controllers/scanController');

const router = express.Router();

router.post('/scans', addScan);
router.get('/scans', listScans);

module.exports = router;

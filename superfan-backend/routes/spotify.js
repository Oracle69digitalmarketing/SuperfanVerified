// routes/spotify.js

const express = require('express');
const router = express.Router();
const { generateProof } = require('../controllers/spotifyController');

router.post('/generate-proof', generateProof);

module.exports = router;

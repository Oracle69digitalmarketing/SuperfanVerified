// routes/spotify.js
import { Router } from 'express';
import { generateProof } from '../controllers/spotifyController.js';

const router = Router();

// POST /spotify/generate-proof
router.post('/generate-proof', generateProof);

export default router;

// routes/zktls.js
import express from 'express';
import { generateProof, verifyProof } from '../controllers/zktlsController.js';

const router = express.Router();

// 🔹 Endpoint to generate a zkTLS proof
router.post('/generate', generateProof);

// 🔹 Endpoint to verify a zkTLS proof
router.post('/verify', verifyProof);

export default router;

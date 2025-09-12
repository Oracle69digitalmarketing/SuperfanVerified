import express from 'express';
import { createToken, listTokens } from '../controllers/tokenController.js';

const router = express.Router();

// Create a new token
router.post('/', createToken);

// List all tokens
router.get('/', listTokens);

export default router;

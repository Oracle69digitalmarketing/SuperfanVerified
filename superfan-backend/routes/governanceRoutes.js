import express from 'express';
import { createProposal, getProposals, voteOnProposal } from '../controllers/governanceController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/proposals', getProposals);
router.post('/proposals', requireAuth, createProposal);
router.post('/proposals/:id/vote', requireAuth, voteOnProposal);

export default router;
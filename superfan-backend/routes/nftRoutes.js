import express from 'express';
import { mintNFT } from '../controllers/nftController.js';

const router = express.Router();

router.post('/mint', mintNFT);

export default router;
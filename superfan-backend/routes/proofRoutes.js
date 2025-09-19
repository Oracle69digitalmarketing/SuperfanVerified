import express from "express";
import { verifyXionDave, verifyZKTLS } from "../controllers/proofController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// Gate with authentication first
router.post("/xion", requireAuth, verifyXionDave);
router.post("/zktls", requireAuth, verifyZKTLS);

export default router;

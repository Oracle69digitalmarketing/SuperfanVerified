// backend/routes/users.js
import express from 'express';
import { createUser, listUsers } from '../controllers/userController.js';

const router = express.Router();

// 🧑 Create or update a user with referral support
router.post('/', createUser);

// 📋 List recent users with referral metadata
router.get('/', listUsers);

export default router;

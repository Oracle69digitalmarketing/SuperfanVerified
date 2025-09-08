const express = require('express');
const {
  createUser,
  listUsers
} = require('../controllers/userController');

const router = express.Router();

// 🧑 Create or update a user with referral support
router.post('/', createUser);

// 📋 List recent users with referral metadata
router.get('/', listUsers);

module.exports = router;

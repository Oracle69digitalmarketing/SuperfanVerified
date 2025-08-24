const { createUser } = require('../models/User');

const signup = async (req, res) => {
  const { username, email, referralCode } = req.body;
  try {
    const user = await createUser(username, email, referralCode);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup };

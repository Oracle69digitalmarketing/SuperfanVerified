const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Superfan backend is running with PostgreSQL' });
});

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Add a user
router.post('/users', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert user' });
  }
});

module.exports = router;

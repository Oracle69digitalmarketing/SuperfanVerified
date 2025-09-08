#!/bin/bash
set -e
echo "⚡ Setting up Superfan backend with Express + PostgreSQL..."

# package.json
cat > package.json <<'EOT'
{
  "name": "superfan-backend",
  "version": "1.0.0",
  "description": "Superfan Verified backend (Express + PostgreSQL)",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "NODE_ENV=development nodemon app.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "pg": "^8.16.3"
  }
}
EOT

# app.js
cat > app.js <<'EOT'
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`✅ Superfan backend running on port \${PORT}\`);
});
EOT

# db.js
cat > db.js <<'EOT'
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'superfan',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
EOT

# routes/userRoutes.js
mkdir -p routes
cat > routes/userRoutes.js <<'EOT'
const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);

module.exports = router;
EOT

# controllers/userController.js
mkdir -p controllers
cat > controllers/userController.js <<'EOT'
const pool = require('../db');

const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const createUser = async (req, res) => {
  const { artist, total_plays } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (artist, total_plays, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [artist, total_plays]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

module.exports = { getUsers, createUser };
EOT

# .env file
cat > .env <<'EOT'
PORT=3000
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=superfan
EOT

echo "✅ Backend files + .env created successfully!"
echo "👉 Next steps:"
echo "1. cd superfan-backend"
echo "2. npm install"
echo "3. Make sure PostgreSQL is running"
echo "4. npm run dev"

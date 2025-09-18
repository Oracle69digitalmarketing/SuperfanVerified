#!/bin/bash
set -e
echo "⚡ Setting up Superfan backend with Express + PostgreSQL + MongoDB + Redis..."

# ---------------------------
# package.json
# ---------------------------
cat > package.json <<'EOT'
{
  "name": "superfan-backend",
  "version": "1.0.0",
  "description": "Superfan Verified backend (Express + PostgreSQL + MongoDB + Redis)",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "NODE_ENV=development nodemon app.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "mongoose": "^8.18.1",
    "redis": "^5.8.2",
    "helmet": "^8.1.0",
    "morgan": "^1.10.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
EOT

# ---------------------------
# app.js
# ---------------------------
cat > app.js <<'EOT'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Routes
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/activity', activityRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Superfan backend running on port ${PORT}`));
EOT

# ---------------------------
# db.js (PostgreSQL pool)
# ---------------------------
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

# ---------------------------
# routes/userRoutes.js
# ---------------------------
mkdir -p routes
cat > routes/userRoutes.js <<'EOT'
const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);

module.exports = router;
EOT

# ---------------------------
# controllers/userController.js
# ---------------------------
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

# ---------------------------
# routes/activityRoutes.js
# ---------------------------
cat > routes/activityRoutes.js <<'EOT'
const express = require('express');
const { getActivities, createActivity } = require('../controllers/activityController');
const router = express.Router();

router.get('/', getActivities);
router.post('/', createActivity);

module.exports = router;
EOT

# ---------------------------
# controllers/activityController.js
# ---------------------------
cat > controllers/activityController.js <<'EOT'
const pool = require('../db');

const getActivities = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activities ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

const createActivity = async (req, res) => {
  const { name, points } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO activities (name, points, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [name, points]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
};

module.exports = { getActivities, createActivity };
EOT

# ---------------------------
# .env file
# ---------------------------
cat > .env <<'EOT'
PORT=3000
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=superfan
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
MONGO_URI=mongodb://localhost:27017/superfan
EOT

echo "✅ Backend setup complete!"
echo "👉 Next steps:"
echo "1. cd superfan-backend"
echo "2. npm install"
echo "3. Ensure PostgreSQL, MongoDB, Redis are running"
echo "4. npm run dev"EOT

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

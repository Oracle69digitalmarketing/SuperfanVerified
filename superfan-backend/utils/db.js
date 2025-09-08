const { Pool } = require('pg');

// Optional: Load environment variables from .env file
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'superfan',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Optional: Log connection status
pool
  .connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch((err) => console.error('❌ PostgreSQL connection error:', err));

module.exports = pool;

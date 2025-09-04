const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'your_db_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'superfan',
  password: process.env.DB_PASSWORD || 'your_db_password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

module.exports = pool;

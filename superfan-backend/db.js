const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER || 'your_db_user',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'superfan',
  password: process.env.PGPASSWORD || 'your_db_password',
  port: parseInt(process.env.PGPORT, 10) || 5432,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

module.exports = pool;

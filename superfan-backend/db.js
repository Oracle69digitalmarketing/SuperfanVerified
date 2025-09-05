const { Pool } = require('pg');

let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  pool = new Pool({
    user: process.env.PGUSER || 'your_db_user',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'superfan',
    password: process.env.PGPASSWORD || 'your_db_password',
    port: parseInt(process.env.PGPORT || '5432', 10)
  });
}

module.exports = pool;

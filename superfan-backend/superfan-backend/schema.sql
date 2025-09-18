-- Drop if exists (clean reset)
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example seed user (optional)
-- INSERT INTO users (name, email, password)
-- VALUES ('Test User', 'test@example.com', 'hashedpassword');

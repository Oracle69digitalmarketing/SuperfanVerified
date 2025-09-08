1-- Superfan Backend: Tables + Sample Data

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_content_user ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);

INSERT INTO users (name, email)
VALUES ('Test User', 'test@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO content (user_id, title, body)
VALUES ((SELECT id FROM users WHERE email='test@example.com'), 'Hello World', 'Sample content')
ON CONFLICT DO NOTHING;

INSERT INTO payments (user_id, amount, status)
VALUES ((SELECT id FROM users WHERE email='test@example.com'), 50.00, 'completed')
ON CONFLICT DO NOTHING;

🚀 Superfan Backend

Backend service for Superfan Verified — powered by XION + zkTLS + Spotify OAuth.
Handles authentication, proof generation, and persistence for fan verification.


---

📦 Tech Stack

Node.js + Express — REST API

MongoDB + Mongoose — user + fan data persistence

Passport.js — multi-provider auth (Spotify integrated)

zkTLS (Reclaim Protocol) — verifiable internet data proofs

XION SDK — on-chain transactions on testnet

Redis (optional) — caching + session optimization



---

⚙️ Setup

1. Clone repo

git clone https://github.com/your-org/superfan-backend.git
cd superfan-backend

2. Install dependencies

npm install

3. Configure environment

Copy .env.example → .env and fill in real keys:

cp .env.example .env

Fill in your secrets:

MongoDB URI

JWT + session secrets

Spotify Client ID/Secret

zkTLS API key + endpoint

XION testnet API key



---

▶️ Run the server

Development

npm run dev

Production

npm start

Server runs at:

http://localhost:5000


---

🧪 API Endpoints

Health check

GET /health

Auth (Spotify)

GET /auth/spotify
GET /auth/spotify/callback

zkTLS Proof

POST /api/spotify/generate-proof

Dashboard (example)

GET /dashboard


---

📜 License

MIT License — Open Source Hackathon Release


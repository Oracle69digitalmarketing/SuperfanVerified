<<<<<<< HEAD
🚀 Superfan Backend

Backend service for Superfan Verified — powered by XION + zkTLS + Spotify OAuth.
Handles authentication, proof generation, and persistence for fan verification.
=======
# 🎧 Superfan Verified

🔥 Overview
Superfan Verified is a decentralized mobile-first application (dApp) that empowers fans to prove their loyalty using verifiable, on-chain credentials derived from their Spotify streaming history. Built on the XION blockchain, it leverages zero-knowledge proofs to transform private, off-chain data into secure, privacy-preserving digital badges.
>>>>>>> b0d8182 (update dockerfiles and backend)


---

<<<<<<< HEAD
📦 Tech Stack

Node.js + Express — REST API

MongoDB + Mongoose — user + fan data persistence

Passport.js — multi-provider auth (Spotify integrated)

zkTLS (Reclaim Protocol) — verifiable internet data proofs

XION SDK — on-chain transactions on testnet

Redis (optional) — caching + session optimization
=======
## 🚨 The Problem
Fan engagement today is fragmented and centralized. Loyalty is measured through off-chain metrics like streaming counts and social media activity — data that’s:

Controlled by platforms

Vulnerable to manipulation

Impossible to verify on-chain


This limits artists and brands from building trustless, exclusive fan experiences.


---

## ✅ The Solution
Superfan Verified introduces a seamless, mobile-first flow that turns fandom into cryptographic proof:

1. Wallet Creation
Users generate an abstract wallet on the XION Testnet using the XION SDK.


2. Spotify Integration
Fans connect their Spotify account via OAuth to securely fetch their top artists.


3. Zero-Knowledge Proof Generation
Using XION’s zkTLS protocol, the app generates a proof that a specific artist is among the user’s top-played — without revealing full listening history.


4. On-Chain Credential
The proof is recorded on-chain, creating a verifiable, permissionless, and privacy-preserving badge of fandom.

>>>>>>> b0d8182 (update dockerfiles and backend)



---

<<<<<<< HEAD
⚙️ Setup

1. Clone repo

git clone https://github.com/Oracle69digitalmarketing/superfan-backend.git
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
=======
## 🧰 Tech Stack

Technology	Purpose

XION SDK	Wallet creation, abstract accounts, transaction signing
XION zkTLS	Zero-knowledge proof generation from off-chain data
Expo	Cross-platform mobile development with React Native
Spotify Web API	OAuth 2.0 integration and streaming data access
>>>>>>> b0d8182 (update dockerfiles and backend)



---

<<<<<<< HEAD
▶️ Run the server

Development

npm run dev

Production

npm start

Server runs at:

http://localhost:5000
=======
## 🚀 Getting Started

1. Clone the repo  
git clone https://github.com/Oracle69digitalmarketing/SuperfanVerified.git  

2. Navigate to the project folder  
cd SuperfanVerified  

3. Install dependencies  
npm install  

4. Create a .env file with your Spotify credentials  

Example:  
SPOTIFYCLIENTID=yourclientid  
SPOTIFYCLIENTSECRET=yourclientsecret  

5. Start the app  
npx expo start

Scan the QR code with Expo Go to launch the app on your device.
>>>>>>> b0d8182 (update dockerfiles and backend)


---

<<<<<<< HEAD
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
=======
### 🎥 Demo
[demo video link here]
>>>>>>> b0d8182 (update dockerfiles and backend)


---

<<<<<<< HEAD
📜 License

MIT License — Open Source Hackathon Release

=======
🏁 Built For
The XION Hackathon — redefining fandom with cryptographic proof.


---

🧠 How to Pull All Files into GitHub Codespaces

1. Go to the repo: SuperfanVerified on GitHub


2. Click the green Code button


3. Select Open with Codespaces → New codespace


4. Wait for the environment to initialize — you’ll be ready to code instantly
>>>>>>> b0d8182 (update dockerfiles and backend)

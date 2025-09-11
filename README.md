🎧 Superfan Verified

🔥 Overview
Superfan Verified is a decentralized, mobile-first dApp that empowers fans to prove their loyalty using verifiable, on-chain credentials derived from their Spotify streaming history. Built on the XION blockchain, it leverages zkTLS (zero-knowledge Transport Layer Security) to transform private, off-chain data into secure, privacy-preserving digital badges.

---

🚨 The Problem
Fan engagement today is fragmented and centralized. Loyalty is measured through off-chain metrics like streaming counts and social media activity — data that’s:

- Controlled by platforms  
- Vulnerable to manipulation  
- Impossible to verify on-chain  

This limits artists and brands from building trustless, exclusive fan experiences.

---

✅ The Solution
Superfan Verified introduces a seamless, mobile-first flow that turns fandom into cryptographic proof:

1. Wallet Creation  
   Users generate an abstract wallet on the XION Testnet using the XION SDK.

2. Spotify Integration  
   Fans connect their Spotify account via OAuth to securely fetch their top artists.

3. Zero-Knowledge Proof Generation  
   Using XION’s zkTLS protocol, the app generates a proof that a specific artist is among the user’s top-played — without revealing full listening history.

4. On-Chain Credential  
   The proof is recorded on-chain, creating a verifiable, permissionless, and privacy-preserving badge of fandom.

---

🔐 ZKTLS Integration
This project uses zkTLS to generate zero-knowledge proofs from off-chain Spotify data. It ensures that users can verify their fandom without exposing their full listening history.

- zkTLS is used in the proof generation flow  
- Proofs are submitted to the XION blockchain  
- This integration is central to the privacy-preserving design of the app

---

🌐 Backend API
The backend powering Superfan Verified is deployed on Render and handles Spotify data fetching, proof generation, and credential issuance.

Live API Endpoint:  
🔗 https://superfan-backend.onrender.com

---

🧰 Tech Stack

| Technology         | Purpose                                               |
|--------------------|--------------------------------------------------------|
| XION SDK           | Wallet creation, abstract accounts, transaction signing |
| XION zkTLS         | Zero-knowledge proof generation from off-chain data    |
| Expo               | Cross-platform mobile development with React Native    |
| Spotify Web API    | OAuth 2.0 integration and streaming data access        |
| Node.js + Express  | Backend API for Spotify and zkTLS logic                |
| Render             | Cloud deployment of backend services                   |

---

🚀 Getting Started

1. Clone the repo  
   `bash
   git clone https://github.com/Oracle69digitalmarketing/SuperfanVerified.git
   `

2. Navigate to the project folder  
   `bash
   cd SuperfanVerified
   `

3. Install dependencies  
   `bash
   npm install
   `

4. Create a .env file with your Spotify credentials  
   `env
   SPOTIFYCLIENTID=yourclientid  
   SPOTIFYCLIENTSECRET=yourclientsecret
   `

5. Start the app  
   `bash
   npx expo start
   `

Scan the QR code with Expo Go to launch the app on your device.

---

🎥 Demo
[Insert demo video link here]

---

🏁 Built For:  
The XION Hackathon — redefining fandom with cryptographic proof.

---

🧠 GitHub Codespaces Setup

1. Go to the repo: SuperfanVerified  
2. Click the green Code button  
3. Select Open with Codespaces → New codespace

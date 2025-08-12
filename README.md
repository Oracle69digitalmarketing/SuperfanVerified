# Superfan Verified

## Project Description
Superfan Verified is a decentralized application (dApp) that allows users to create on-chain, verifiable proof of their fandom using their Spotify streaming history. We leverage the power of the XION blockchain and zero-knowledge proofs to transform off-chain data into privacy-preserving digital credentials.

## The Problem
In today's digital landscape, a fan's loyalty is often represented by off-chain data (streaming counts, social media posts) that is centralized, unverifiable, and easily lost. This prevents artists and brands from creating truly decentralized, trustless, and exclusive fan experiences.

## The Solution
Superfan Verified solves this by creating a simple, mobile-first user experience:
1. **Wallet Creation:** Users create an abstract account on the XION Testnet.
2. **Spotify Integration:** They connect their Spotify account via OAuth to securely fetch their top artists.
3. **On-Chain Proof:** The app uses the XION SDK's zkTLS functionality to generate a zero-knowledge proof that a specific artist is in their top-played list, without revealing their full streaming history. This proof is then recorded on the blockchain.

The result is a self-sovereign, on-chain credential that proves a user's fandom in a way that is verifiable, permissionless, and privacy-preserving.

## Technologies Used
* **XION SDK:** For abstract accounts, wallet creation, and on-chain transaction broadcasting.
* **XION zkTLS:** The core technology for generating zero-knowledge proofs from off-chain data.
* **Expo:** The React Native framework for a seamless, cross-platform mobile experience.
* **Spotify Web API:** To securely access user streaming data via OAuth 2.0.

## How to Run the Project
1.  Clone the repository: `git clone https://github.com/Oracle69digitalmarketing/SuperfanVerified.git`
2.  Navigate to the directory: `cd SuperfanVerified`
3.  Install dependencies: `npm install`
4.  Set up environment variables: Create a `.env` file with your Spotify `CLIENT_ID` and `CLIENT_SECRET`.
5.  Start the app: `npx expo start`
6.  Scan the QR code with Expo Go.

## Demo
* [Link to your demo video here]

---
*Built for the XION Hackathon.*



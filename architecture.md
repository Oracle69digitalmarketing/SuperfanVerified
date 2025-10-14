# Superfan Verified - Architecture

This document outlines the architecture of the Superfan Verified application.

## High-Level Overview

The application is a mobile-first, decentralized application (dApp) built with React Native and Expo for the frontend, and a serverless Node.js backend running on AWS Lambda. It leverages the XION blockchain for on-chain identity and verification, and a suite of AWS services for its backend infrastructure.

## Architecture Diagram (Mermaid.js)

```mermaid
graph TD
    subgraph User Interface
        A[React Native (Expo) Mobile App]
    end

    subgraph Backend API (AWS Lambda + API Gateway)
        B[/api/auth]
        C[/api/nft]
        D[/api/governance]
        E[/api/leaderboard]
    end

    subgraph AWS Services
        F[Amazon DynamoDB]
        G[Amazon S3]
        H[Amazon Bedrock]
    end

    subgraph XION Blockchain
        I[XION Testnet]
        J[NFT Smart Contract]
        K[Governance Smart Contract]
    end

    A --> B
    A --> C
    A --> D
    A --> E

    B --> F
    C --> F
    C --> H
    C --> I
    D --> F
    D --> I
    E --> F

    I --> J
    I --> K
```

## Components

### 1. Frontend (`superfan-frontend`)

*   **Framework:** React Native with Expo
*   **Blockchain Integration:** XION SDK (`@burnt-labs/abstraxion-react-native`) for wallet creation, zkTLS proofs, and on-chain transactions.
*   **UI:** React components with basic styling.
*   **Deployment:** Built with EAS Build for iOS and Android.

### 2. Backend (`superfan-backend`)

*   **Framework:** Node.js with Express.js
*   **Deployment:** Serverless application deployed to AWS Lambda and API Gateway using the Serverless Framework.
*   **Database:** Amazon DynamoDB for storing user data, superfan scores, proposals, and refresh tokens.
*   **AI Integration:** Amazon Bedrock for generating AI fan art for the NFT badges.

### 3. XION Blockchain

*   **Network:** XION Testnet
*   **Smart Contracts (Placeholders):**
    *   **NFT Smart Contract:** For minting the Superfan NFT badges.
    *   **Governance Smart Contract:** For managing fan club proposals and voting.

## Workflow

1.  **Onboarding:** A new user opens the mobile app, and a XION wallet is automatically created for them using the XION SDK.
2.  **Verification:** The user connects their Spotify account. The frontend uses the XION SDK to generate a zkTLS proof of their listening history and submits it as a transaction to the XION blockchain.
3.  **Scoring:** The backend listens for these on-chain events (or is called by the frontend) and updates the user's "Superfan Score" and "Superfan Coins" in DynamoDB.
4.  **Rewards:** Based on their score and tier, the user can mint an NFT badge (with AI-generated art) and participate in decentralized governance.
5.  **Gamification:** The user can view their rank and tier on the leaderboard, which is populated with data from DynamoDB.

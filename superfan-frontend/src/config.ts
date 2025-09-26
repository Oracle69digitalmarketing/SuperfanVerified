// src/config.ts
// Centralized config for frontend - reads EAS secrets

// ---- Spotify ----
export const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID!;
export const SPOTIFY_CALLBACK_URL = process.env.EXPO_PUBLIC_SPOTIFY_CALLBACK_URL!;

// ---- Google ----
export const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!;
export const GOOGLE_CALLBACK_URL = process.env.EXPO_PUBLIC_GOOGLE_CALLBACK_URL!;

// ---- Facebook ----
export const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID!;
export const FACEBOOK_CALLBACK_URL = process.env.EXPO_PUBLIC_FACEBOOK_CALLBACK_URL!;

// ---- Twitter ----
export const TWITTER_CONSUMER_KEY = process.env.EXPO_PUBLIC_TWITTER_CONSUMER_KEY!;
export const TWITTER_CALLBACK_URL = process.env.EXPO_PUBLIC_TWITTER_CALLBACK_URL!;

// ---- Reclaim ----
export const RECLAIM_PROVIDER_ID = process.env.EXPO_PUBLIC_RECLAIM_PROVIDER_ID!;
export const RECLAIM_API_URL = process.env.EXPO_PUBLIC_RECLAIM_API_URL!;

// ---- XION / RUM ----
export const RUM_CONTRACT_ADDRESS = process.env.EXPO_PUBLIC_RUM_CONTRACT_ADDRESS!;
export const TREASURY_CONTRACT_ADDRESS = process.env.EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS!;
export const RPC_ENDPOINT = process.env.EXPO_PUBLIC_RPC_ENDPOINT!;
export const REST_ENDPOINT = process.env.EXPO_PUBLIC_REST_ENDPOINT!;

// ---- App / Feature flags ----
export const APP_NAME = "SuperfanVerified";
export const XION_NETWORK = process.env.XION_NETWORK || "testnet";
export const ZKPROOF_ENDPOINT = process.env.ZKPROOF_ENDPOINT || "https://api.reclaimprotocol.org/generate-proof";

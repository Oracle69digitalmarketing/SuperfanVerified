// config.ts
// Centralized app configs + env mapping

// 🔗 Chain / Wallet
export const APP_NAME =
  process.env.EXPO_PUBLIC_APP_NAME || "SuperfanVerified";
export const CHAIN_ID =
  process.env.EXPO_PUBLIC_CHAIN_ID || "xion-testnet-1"; // default to testnet

// ⚡ Smart Contracts
export const RUM_CODE_ID = Number(
  process.env.EXPO_PUBLIC_RUM_CODE_ID || 1289
);
export const RUM_CONTRACT_ADDRESS =
  process.env.EXPO_PUBLIC_RUM_CONTRACT_ADDRESS || "";

// 🛡️ Reclaim / Verification
export const RECLAIM_PROVIDER_ID =
  process.env.EXPO_PUBLIC_RECLAIM_PROVIDER_ID || "";
export const RECLAIM_CLAIM_KEY = "followers_count"; // tweak if logic changes

// 🌍 API Endpoints
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.superfanverified.com";

// 🎛️ Feature Flags
export const FEATURE_FLAGS = {
  debugMode: process.env.EXPO_PUBLIC_DEBUG_MODE === "true",
  enableZkTLS: true,
  enableXionDave: true,
};

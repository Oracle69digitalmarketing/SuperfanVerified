// src/globals.ts
// Centralized frontend configuration for Superfan Verified
// ---------------------------------------------------------
// ✅ Organized for dev vs production
// ✅ Uses environment variables with fallbacks
// ✅ Easy to extend with more services

// -------------------------
// App Environment
// -------------------------
export const ENV = {
  APP_NAME: "Superfan Verified",
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_DEV: process.env.NODE_ENV !== "production",
};

// -------------------------
// Backend URLs
// -------------------------
export const API = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  BACKEND_URL:
    process.env.EXPO_PUBLIC_BACKEND_URL ||
    "https://superfan-backend.onrender.com",
};

// -------------------------
// Expo / App Scheme
// -------------------------
export const APP_SCHEME = {
  SCHEME: "superfan",
  DEV_URL: process.env.EXPO_DEV_URL || "exp://localhost:19006",
  FRONTEND_URL: process.env.EXPO_PUBLIC_FRONTEND_URL || "http://localhost:3000",
};

// -------------------------
// OAuth Redirect URIs
// -------------------------
export const OAUTH = {
  SPOTIFY_REDIRECT_URI:
    process.env.EXPO_PUBLIC_SPOTIFY_REDIRECT_URI ||
    "superfan://auth/spotify/callback",
  GITHUB_REDIRECT_URI:
    process.env.EXPO_PUBLIC_GITHUB_REDIRECT_URI ||
    "superfan://auth/github/callback",
  GOOGLE_REDIRECT_URI:
    process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI ||
    "superfan://auth/google/callback",
  LINKEDIN_REDIRECT_URI:
    process.env.EXPO_PUBLIC_LINKEDIN_REDIRECT_URI ||
    "superfan://auth/linkedin/callback",
  TWITTER_REDIRECT_URI:
    process.env.EXPO_PUBLIC_TWITTER_REDIRECT_URI ||
    "superfan://auth/twitter/callback",
};

// -------------------------
// Reclaim / XION Endpoints
// -------------------------
export const ZKPROOF = {
  RECLAIM_API_URL:
    process.env.EXPO_PUBLIC_RECLAIM_API_URL ||
    "https://api.reclaimprivacy.com",
  RECLAIM_APP_ID:
    process.env.EXPO_PUBLIC_RECLAIM_APP_ID ||
    "0xE11e72D9D5f0593304CfD7D2feF95Ab54d245ae4",
  ZKPROOF_ENDPOINT:
    process.env.EXPO_PUBLIC_ZKPROOF_ENDPOINT ||
    "https://api.reclaimprotocol.org/generate-proof",
  XION_NETWORK: process.env.EXPO_PUBLIC_XION_NETWORK || "testnet",
  XION_API_KEY:
    process.env.EXPO_PUBLIC_XION_API_KEY ||
    "xion1qf8jtznwf0tykpg7e65gwafwp47rwxl4x2g2kldvv357s6frcjlsh2m24e",
};

// -------------------------
// CORS / Dev URLs
// -------------------------
export const CORS = {
  ORIGINS: [
    "http://localhost:3000",
    "exp://*",
    "https://expo.dev",
    ...(process.env.EXPO_PUBLIC_CORS_ORIGINS?.split(",") || []),
  ],
  EXPO_DEV_URL: process.env.EXPO_DEV_URL || "http://localhost:5000",
};

// -------------------------
// Email / Notification Defaults
// -------------------------
export const EMAIL = {
  FROM: process.env.EXPO_PUBLIC_EMAIL_FROM || "no-reply@oracle69.com",
  DEFAULT_HOST:
    process.env.EXPO_PUBLIC_EMAIL_HOST || "smtp.oracle69.com",
  DEFAULT_PORT:
    Number(process.env.EXPO_PUBLIC_EMAIL_PORT) || 587,
};

// -------------------------
// Misc / Constants
// -------------------------
export const APP_CONSTANTS = {
  TOKEN_STORAGE_KEY:
    process.env.EXPO_PUBLIC_TOKEN_STORAGE_KEY || "superfan_tokens",
  SESSION_STORAGE_KEY:
    process.env.EXPO_PUBLIC_SESSION_STORAGE_KEY || "superfan_session",
};

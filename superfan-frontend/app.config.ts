import 'dotenv/config';
import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'SuperfanVerified',
  slug: 'superfanverified',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.yourcompany.superfanverified',
  },
  android: {
    package: 'com.yourcompany.superfanverified',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    // EAS project ID
    eas: {
      projectId: '8203d4d6-e559-4279-9ddc-4403c4243c9f',
    },

    // Backend / API
    API_BASE_URL: process.env.API_BASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    FRONTEND_SCHEME: process.env.FRONTEND_SCHEME,
    EXPO_PREVIEW_URL: process.env.EXPO_PREVIEW_URL,
    EXPO_STAGING_URL: process.env.EXPO_STAGING_URL,
    EXPO_PRODUCTION_URL: process.env.EXPO_PRODUCTION_URL,

    // --- Xion / RUM ---
    RUM_CONTRACT_ADDRESS: process.env.EXPO_PUBLIC_RUM_CONTRACT_ADDRESS,
    RECLAIM_PROVIDER_ID: process.env.EXPO_PUBLIC_RECLAIM_PROVIDER_ID,

    // --- Spotify ---
    SPOTIFY_CLIENT_ID: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
    SPOTIFY_CALLBACK_URL: process.env.EXPO_PUBLIC_SPOTIFY_CALLBACK_URL,

    // --- Google ---
    GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    GOOGLE_CALLBACK_URL: process.env.EXPO_PUBLIC_GOOGLE_CALLBACK_URL,

    // --- Facebook ---
    FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
    FACEBOOK_CALLBACK_URL: process.env.EXPO_PUBLIC_FACEBOOK_CALLBACK_URL,

    // --- Twitter ---
    TWITTER_CONSUMER_KEY: process.env.EXPO_PUBLIC_TWITTER_CONSUMER_KEY,
    TWITTER_CALLBACK_URL: process.env.EXPO_PUBLIC_TWITTER_CALLBACK_URL,

    // --- LinkedIn ---
    LINKEDIN_CLIENT_ID: process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID,
    LINKEDIN_CALLBACK_URL: process.env.EXPO_PUBLIC_LINKEDIN_CALLBACK_URL,
  },
};

// Ensure EAS sees this
export default config;

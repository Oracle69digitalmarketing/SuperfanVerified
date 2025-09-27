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
  assetBundlePatterns: ['**/*'],
  plugins: ['expo-asset'],
  
  // Add web-specific assets
  web: {
    favicon: './assets/favicon.png',
    build: {
      babel: {
        include: ['components', 'screens'], // make sure your components are compiled for web
      },
    },
  },

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
  extra: {
    eas: {
      projectId: '8203d4d6-e559-4279-9ddc-4403c4243c9f',
    },
    API_BASE_URL: process.env.API_BASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    FRONTEND_SCHEME: process.env.FRONTEND_SCHEME,
    EXPO_PREVIEW_URL: process.env.EXPO_PREVIEW_URL,
  },
};

export default config;

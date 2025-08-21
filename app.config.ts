import { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'SuperfanVerified',
  slug: 'superfanverified',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    package: 'com.superfanverified.app', // ✅ added package name
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: '8203d4d6-e559-4279-9ddc-4403c4243c9f',
    },
    RPC_URL: 'https://rpc.testnet.xion.dev',
    CHAIN_ID: 42069,
  },
};

export default config;

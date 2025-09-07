import { ExpoConfig, ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "SuperfanVerified",
  slug: "superfan-verified",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.oracle69digitalmarketing.superfanverified"
  },
  android: {
    package: "com.superfanverified.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      projectId: "8203d4d6-e559-4279-9ddc-4403c4243c9f"
    },
    RPC_URL: "https://rpc.testnet.xion.dev",
    CHAIN_ID: 42069
  },
  plugins: [
    [
      "sentry-expo",
      {
        dsn: "https://97d9eld6551dfd69929529dd6b4658c6@o4509865650421760.ingest.sentry.io/9884240822352",
        enableInExpoDevelopment: true,
        debug: false
      }
    ],
    "expo-sqlite"
  ]
});

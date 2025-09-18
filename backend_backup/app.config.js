export default {
  name: "SuperfanVerified",
  slug: "superfanverified",  // MUST match Expo project slug
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.oracle69digitalmarketing.superfanverified",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    }
  },
  android: {
    package: "com.superfanverified.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: ["expo-sqlite"],
  extra: {
    apiUrl: "https://superfan-backend.onrender.com",
    rpcUrl: "https://rpc.testnet.xion.dev",
    chainId: 42069,
    owner: "oracle69",
    eas: {
      projectId: "8203d4d6-e559-4279-9ddc-4403c4243c9f"
    }
  },
  cli: {
    appVersionSource: "remote"
  }
};

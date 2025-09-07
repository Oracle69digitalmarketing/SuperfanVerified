export default ({ config }) => ({
  ...config,
  name: "SuperfanVerified",
  slug: "superfanverified", // remove the dash to match EAS project
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  updates: {
    fallbackToCacheTimeout: 0,
  },
  ios: {
    bundleIdentifier: "com.superfan.verified",
    supportsTablet: true,
  },
  android: {
    package: "com.superfan.verified",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    apiUrl: process.env.API_URL || "https://superfan-backend.onrender.com",
    eas: {
      projectId: "8203d4d6-e559-4279-9ddc-4403c4243c9f",
    },
  },
  cli: {
    appVersionSource: "remote",
  },
});

export default ({ config }) => ({
  ...config,
  name: "Superfan Project",
  slug: "superfan-project-1",
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
    bundleIdentifier: "com.superfan.project1",
    supportsTablet: true,
  },
  android: {
    package: "com.superfan.project1",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
});

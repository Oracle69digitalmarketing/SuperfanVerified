export default {
  expo: {
    name: "SuperFanVerified",
    slug: "superfanverified",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.superfan.verified"
    },
    android: {
      package: "com.superfan.verified",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      permissions: [
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-sqlite",
        {
          enableFTS: true,
          useSQLCipher: false
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: "We need access to your camera to let you take profile photos."
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "8203d4d6-e559-4279-9ddc-4403c4243c9f"
      }
    }
  }
};

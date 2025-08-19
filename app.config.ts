// app.config.ts
//...
export default {
  //...
  ios: {
    bundleIdentifier: 'com.superfanverified',
    supportsTablet: true
  },
  android: {
    package: 'com.superfanverified',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    }
  },
  extra: {
    // Expose secrets from .env
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET
  },
  plugins: [
    [
      "expo-build-properties",
      {
        "android": {
          "minSdkVersion": 25
        }
      }
    ],
    "@logrocket/react-native"
  ]
};


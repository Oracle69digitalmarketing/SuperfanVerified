// app.config.ts

module.exports = ({ config }) => {

  // `config` can be empty when running `npx expo config` in a clean environment.

  // We need to provide default empty objects to avoid `undefined` errors.

  const expoConfig = config?.expo || {};

  const extraConfig = expoConfig?.extra || {};


  return {

    expo: {

      ...expoConfig,

      name: "SuperfanVerified",

      slug: "superfanverified",

      version: "1.0.0",

      orientation: "portrait",

      icon: "./assets/icon.png",

      userInterfaceStyle: "light",

      splash: {

        image: "./assets/splash.png",

        resizeMode: "contain",

        backgroundColor: "#ffffff"

      },

      assetBundlePatterns: [

        "**/*"

      ],

      ios: {

        bundleIdentifier: "com.oracle69digitalmarketing.superfanverified",

        supportsTablet: true

      },

      android: {

        adaptiveIcon: {

          foregroundImage: "./assets/adaptive-icon.png",

          backgroundColor: "#ffffff"

        },

        package: "com.oracle69digitalmarketing.superfanverified"

      },

      web: {

        favicon: "./assets/favicon.png"

      },

      extra: {

        ...extraConfig,

        eas: {

          projectId: "8203d4d6-e559-4279-9ddc-4403c4243c9f"

        },

        RPC_URL: "https://rpc.xion-testnet-2.burnt.com:443",

        CHAIN_ID: "xion-testnet-2",

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

    }

  };

};
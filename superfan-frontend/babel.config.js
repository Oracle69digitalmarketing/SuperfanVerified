module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",          // Essential for Expo apps
      "@babel/preset-env",          // For web targets
      ["@babel/preset-react", { runtime: "automatic" }], // React JSX
      "@babel/preset-typescript"    // TypeScript support
    ],
    plugins: [
      "@babel/plugin-transform-runtime", // Reuse Babel helpers
      "react-native-reanimated/plugin",  // Only if using Reanimated
      ["@babel/plugin-transform-class-properties", { loose: true }],
      ["@babel/plugin-transform-private-methods", { loose: true }],
      ["@babel/plugin-transform-private-property-in-object", { loose: true }]
    ].filter(Boolean),
  };
};

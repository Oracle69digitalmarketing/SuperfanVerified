const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const defaultConfig = getDefaultConfig(__dirname);

// 🛑 Block problematic paths using exclusionList
defaultConfig.resolver.blockList = exclusionList([
  /superfan-verified\/frontend\/superfan-frontend\/xion-mobile-quickstart/,
]);

// 🧩 Optional: Handle extraNodeModules if needed
defaultConfig.resolver.extraNodeModules = {
  // Example: force resolution of react-native to local node_modules
  'react-native': require.resolve('react-native'),
  // Add other modules here if needed
};

// 🧼 Optional: Improve asset resolution
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');
defaultConfig.resolver.sourceExts.push('svg');

module.exports = defaultConfig;

// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// This is a more comprehensive way to ignore the problematic path
defaultConfig.resolver.blockList = [
    /superfan-verified\/frontend\/superfan-frontend\/xion-mobile-quickstart/,
];

// You may also need to check the `extraNodeModules` if the package
// is trying to link to a non-existent local file system package.
// This is less common but worth checking if the first fix doesn't work.

module.exports = defaultConfig;


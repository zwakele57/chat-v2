const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add explicit node modules path for expo-modules-core
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules/expo-modules-core'),
  ...config.resolver.nodeModulesPaths || []
];

module.exports = config;
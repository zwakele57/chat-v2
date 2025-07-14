const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable symlinks and proper module resolution for TypeScript files
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_conditionNames = ['browser', 'module', 'main'];

module.exports = config;
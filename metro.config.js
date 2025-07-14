const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add TypeScript extensions to resolver
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;
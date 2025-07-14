const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper Babel transformation for TypeScript files
config.transformer.babelTransformerPath = require.resolve('metro-react-native-babel-transformer');

module.exports = config;
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// (Optional) keep this ONLY if you still see “multiple instances of three” later.
// If you want to be extra safe right now, you can delete this block entirely.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  three: require.resolve("three"),
};

module.exports = config;


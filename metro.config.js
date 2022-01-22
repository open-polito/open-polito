/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require("path");

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // https://stackoverflow.com/a/60099655
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx'],
    extraNodeModules: {
      "@config": path.resolve(__dirname, "src/buildConfig", `${process.env.METRO_VARIANT}.json`)
    }
  }
};

const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const analyzeBundle = process.env.ANALYZE_BUNDLE === '1';

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  if (analyzeBundle) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};

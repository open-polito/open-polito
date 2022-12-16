const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  if (process.env.ANALYZE_BUNDLE === '1') {
    config.plugins.push(
      new MomentLocalesPlugin({
        localesToKeep: ['it'],
      }),
      new BundleAnalyzerPlugin({
        path: 'web-report',
      }),
    );
  }

  // Enable tree-shaking
  config.optimization = {
    usedExports: true,
  };

  return config;
};

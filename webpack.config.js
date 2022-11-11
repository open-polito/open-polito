const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  if (process.env.ANALYZE_BUNDLE === '1') {
    config.plugins.push(
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

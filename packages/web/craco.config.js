const path = require('path');
const webpack = require('webpack');

const PLATFORM = process.env.PLATFORM;
const platforms = [...(PLATFORM === 'DESKTOP' ? ['.desktop'] : []), '.web', ''];
const exts = ['.tsx', '.ts', '.jsx', '.js', '.cjs'];

const resolveExtensions = [
  ...platforms.flatMap(p => exts.map(ext => p + ext)),
  '...',
];

const resolve = _path => path.resolve(__dirname, _path);

const appIncludes = ['src', '../common/src'].map(module => resolve(module));

module.exports = {
  babel: {
    plugins: ['react-native-web', 'react-native-reanimated/plugin'],
  },
  webpack: {
    plugins: {
      add: [new webpack.DefinePlugin({__DEV__: false})],
    },
    configure(webpackConfig) {
      webpackConfig.entry = ['@babel/polyfill', webpackConfig.entry];
      //   console.log(JSON.stringify(webpackConfig.module.rules, null, 4));
      webpackConfig.module.rules[1].oneOf[3].options.cacheDirectory = false;
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        plugin => plugin.constructor.name !== 'ModuleScopePlugin',
      );

      webpackConfig.module.rules[0].include = appIncludes;
      webpackConfig.module.rules[1].oneOf[3].include = appIncludes;
      //   webpackConfig.module.rules[1].oneOf[3].options.plugins.push(
      //     require.resolve('babel-plugin-react-native-web'),
      //   );
      webpackConfig.module.rules.push({
        test: /\.js$/,
        include: [path.resolve('../../node_modules/react-native-reanimated')],

        loader: 'babel-loader',
        options: {
          presets: [
            [
              'module:metro-react-native-babel-preset',
              {useTransformReactJSXExperimental: true},
            ],
          ],
          plugins: [
            'react-native-web',
            'react-native-reanimated/plugin',
            [
              '@babel/plugin-transform-react-jsx',
              {
                runtime: 'automatic',
              },
            ],
            '@babel/plugin-proposal-export-namespace-from',
          ],
        },
      });
      //   console.log(JSON.stringify(webpackConfig, null, 4));
      return webpackConfig;
    },
  },
};

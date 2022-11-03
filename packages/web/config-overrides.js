const path = require('path');
const PLATFORM = process.env.PLATFORM;
const {
  override,
  babelInclude,
  addWebpackModuleRule,
  addWebpackResolve,
  addWebpackAlias,
  addWebpackPlugin,
  addBabelPlugin,
  addBabelPlugins,
} = require('customize-cra');
const webpack = require('webpack');

const platforms = [...(PLATFORM === 'DESKTOP' ? ['.desktop'] : []), '.web', ''];
const exts = ['.tsx', '.ts', '.jsx', '.js', '.cjs'];

const resolveExtensions = [
  ...platforms.flatMap(p => exts.map(ext => p + ext)),
  '...',
];

const resolve = _path => path.resolve(__dirname, _path);

const appIncludes = ['src', '../common/src'].map(module => resolve(module));

module.exports = function (config, env) {
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => plugin.constructor.name !== 'ModuleScopePlugin',
  );

  config.module.rules[0].include = appIncludes;
  config.module.rules[1].oneOf[3].include = appIncludes;
  config.module.rules[1].oneOf[3].options.plugins.push(
    require.resolve('babel-plugin-react-native-web'),
  );

  const conf = Object.assign(
    config,
    override(
      babelInclude([
        /* transpile (converting to es5) code in src/ and shared component library */
        path.resolve('src'),
        path.resolve('../common/src'),
      ]),
      addWebpackModuleRule({
        test: /\.(js)x?$/,
        // exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            {
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-flow-strip-types',
              ],
            },
          ],
        },
      }),
      addWebpackModuleRule({
        test: /\.ttf$/,
        type: 'asset/resource',
      }),
      addWebpackResolve({
        extensions: resolveExtensions,
      }),
      addWebpackAlias({
        'react-native-linear-gradient': 'react-native-web-linear-gradient',
      }),
      // This plugin is needed because react-native-gesture-handler needs this variable
      addWebpackPlugin(
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(env.mode !== 'production'),
        }),
      ),
      // addBabelPlugin('react-native-reanimated/plugin'),
      // addBabelPlugin('@babel/plugin-syntax-jsx'),
      // addBabelPlugins(
      //   '@babel/plugin-proposal-class-properties',
      //   '@babel/plugin-transform-flow-strip-types',
      //   '@babel/plugin-proposal-export-namespace-from',
      //   'react-native-reanimated/plugin',
      // ),
      // addBabelPresets('@babel/preset-env', '@babel/preset-react'),
    )(config, env),
  );

  config.entry = ['@babel/polyfill', config.entry];
  config.plugins.push(new webpack.EnvironmentPlugin({JEST_WORKER_ID: null}));
  config.plugins.push(new webpack.DefinePlugin({process: {env: {}}}));

  config.module.rules.push({
    test: /\.js$/,
    include: [resolve('../../node_modules/react-native-reanimated')],
    use: {
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
    },
  });

  console.log('CONF', JSON.stringify(conf, null, 4));

  return conf;
};

const path = require('path');

module.exports = ({ root, port }) => ({
  mode: 'development',
  entry: [
    '@babel/polyfill',
    './test/index.js',
  ],
  devServer: {
    port,
    contentBase: path.join(root, 'test'),
    watchContentBase: true,
    compress: true,
    host: '0.0.0.0',
    open: true,
    useLocalIp: true,
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                debug: true,
                useBuiltIns: 'entry',
                targets: {
                  browsers: [
                    'and_chr 64',
                    'chrome 64',
                    'ios_saf 11',
                    'firefox 57',
                    'samsung 6.2',
                    'edge 16',
                  ],
                },
              }],
            ],
          },
        },
      },
    ],
  },
});

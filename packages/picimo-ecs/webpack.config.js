const path = require('path');

module.exports = {
  mode: 'development',
  entry: './test/index.js',
  devServer: {
    contentBase: path.join(__dirname, 'test'),
    watchContentBase: true,
    compress: true,
    host: '0.0.0.0',
    port: 8083,
  },
  resolve: {
    alias: {
      '@picimo/core': path.resolve(__dirname, '../picimo-core'),
    },
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
};

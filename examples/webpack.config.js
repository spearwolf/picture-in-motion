const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
    'ClearBackground/app': './src/ClearBackground/index.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
    compress: true,
    host: '0.0.0.0',
    port: 8080,
  },
  resolve: {
    alias: {
      '@picimo/core': path.resolve(__dirname, '../packages/picimo-core'),
      '@picimo/renderer': path.resolve(__dirname, '../packages/picimo-renderer'),
      '@picimo/react': path.resolve(__dirname, '../packages/picimo-react'),
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
                    'ie 11',
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

const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
    'ClearBackground/app': './src/ClearBackground/index.js',
    'HelloWorld/bundle': './src/HelloWorld/index.js',
    'SpriteGroup/bundle': './src/SpriteGroup/index.js',
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
      '@picimo/ecs': path.resolve(__dirname, '../packages/picimo-ecs'),
      '@picimo/react': path.resolve(__dirname, '../packages/picimo-react'),
      '@picimo/renderer': path.resolve(__dirname, '../packages/picimo-renderer'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[hash].[ext]',
          publicPath: 'http://localhost:8080/',
        },
      },
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

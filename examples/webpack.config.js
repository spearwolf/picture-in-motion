const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-maps',
  entry: {
    main: ['@babel/polyfill', './src/main.js'],
    'basics/HelloWorld/bundle': ['@babel/polyfill', './src/basics/HelloWorld/index.js'],
    'basics/InstancedQuads/bundle': ['@babel/polyfill', './src/basics/InstancedQuads/main.js'],
    'advanced/HelloWorld/bundle': ['@babel/polyfill', './src/advanced/HelloWorld/index.js'],
    'advanced/SpriteGroup/bundle': ['@babel/polyfill', './src/advanced/SpriteGroup/index.js'],
    'advanced/HelloInstancedWorld/bundle': ['@babel/polyfill', './src/advanced/HelloInstancedWorld/index.js'],
    'advanced/TexturedSpriteGroup/bundle': ['@babel/polyfill', './src/advanced/TexturedSpriteGroup/index.js'],
    'demo/Starscape/bundle': ['@babel/polyfill', './src/demo/Starscape/index.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
    compress: true,
    host: '0.0.0.0',
    port: 8080,
    open: true,
    useLocalIp: true,
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[hash].[ext]',
          publicPath: '/',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                debug: false,
                useBuiltIns: 'entry',
                targets: {
                  browsers: [
                    'and_chr 69',
                    'chrome 69',
                    'ios_saf 12',
                    'firefox 62',
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

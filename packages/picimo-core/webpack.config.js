const path = require('path');

module.exports = {
  mode: 'development',
  entry: './test/index.js',
  devServer: {
    contentBase: path.join(__dirname, 'test'),
    watchContentBase: true,
    compress: true,
    host: '0.0.0.0',
    port: 8080,
  },
};

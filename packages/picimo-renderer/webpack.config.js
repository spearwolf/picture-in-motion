module.exports = {
  mode: 'development',
  entry: './test/index.js',
  serve: {
    content: 'test',
    hot: {
      hot: false,
      reload: true,
    },
  },
};

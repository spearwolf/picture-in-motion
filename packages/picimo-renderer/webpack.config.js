module.exports = {
  mode: 'development',
  entry: './test/index.js',
  serve: {
    content: 'test',
    host: '192.168.178.44',
    hot: {
      host: '192.168.178.44',
      hot: true,
      reload: false,
    },
  },
};

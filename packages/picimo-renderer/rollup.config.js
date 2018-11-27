import config from '../../shared/rollup.config';

export default config({
  name: 'PicimoRenderer',
  root: __dirname,
  filename: 'picimo-renderer',
  external: [
    '@picimo/core',
    '@picimo/utils',
    'gl-matrix',
    'loglevel',
  ],
});

import config from '../../shared/rollup.config';

export default config({
  name: 'PicimoCore',
  root: __dirname,
  filename: 'picimo-core',
  external: [
    '@picimo/utils',
    'gl-matrix',
  ],
});

import config from '../../shared/rollup.config';

export default config({
  name: 'PicimoToolkit',
  root: __dirname,
  filename: 'picimo-toolkit',
  external: [
    '@picimo/core',
    '@picimo/utils',
    'gl-matrix',
    'loglevel',
  ],
});

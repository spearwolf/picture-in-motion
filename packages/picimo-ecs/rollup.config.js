import config from '../../shared/rollup.config';

export default config({
  root: __dirname,
  filename: 'picimo-ecs',
  external: [
    '@picimo/core',
    '@picimo/utils',
    '@spearwolf/eventize',
    'gl-matrix',
    'loglevel',
  ],
});

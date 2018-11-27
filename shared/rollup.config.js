import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

export default ({
  root,
  filename,
  external,
  name, // The variable name, representing your iife/umd bundle, by which other scripts on the same page can access it.
}) => ({
  external,
  input: 'src/index.js',
  output: {
    name,
    file: path.join(root, 'dist', `${filename}.js`),
    sourcemap: true,
    sourcemapFile: path.join(root, 'dist', `${filename}.js.map`),
    format: 'umd',
    globals: (() => {
      const GLOBALS = {
        '@picimo/core': 'PicimoCore',
        '@picimo/ecs': 'PicimoECS',
        '@picimo/toolkit': 'PicimoToolkit',
        '@picimo/utils': 'PicimoUtils',
        '@spearwolf/eventize': 'eventize',
        'gl-matrix': 'glMatrix',
        eventize: 'eventize',
        loglevel: 'log',
      };
      const g = {};
      Object.keys(GLOBALS).forEach((key) => {
        const val = GLOBALS[key];
        if (val !== name) {
          g[key] = val;
        }
      });
      return g;
    })(),
  },
  plugins: [
    babel({
      exclude: [
        /node_modules/,
      ],
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            ignoreBrowserslistConfig: true,
            modules: false,
            useBuiltIns: 'usage',
          },
        ],
      ],
    }),
    commonjs(),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    sizeSnapshot(),
    terser(),
  ],
});

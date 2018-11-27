import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

import bannerPlugin from '../../shared/bannerPlugin';

const packageJson = require('./package.json');

const config = {
  input: 'src/picimo.js',
};

const plugins = {
  banner: bannerPlugin(packageJson),
  commonjs: commonjs(),
  resolve: resolve({
    customResolveOptions: {
      moduleDirectory: 'node_modules',
    },
  }),
  replace: replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  terser: terser({
    output: { comments: /^!/ },
  }),
};

export default [
  {
    ...config,
    output: {
      name: 'picimo',
      file: path.join(__dirname, 'dist', 'picimo.js'),
      sourcemap: true,
      sourcemapFile: path.join(__dirname, 'dist', 'picimo.js.map'),
      format: 'umd',
    },
    plugins: [
      plugins.banner,
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
              useBuiltIns: 'entry',
            },
          ],
        ],
      }),
      plugins.commonjs,
      plugins.resolve,
      plugins.replace,
      sizeSnapshot({ snapshotPath: '.size-snapshot__picimo_js.json' }),
      plugins.terser,
    ],
  },
  {
    ...config,
    output: {
      file: path.join(__dirname, 'dist', 'picimo.mjs'),
      sourcemap: true,
      sourcemapFile: path.join(__dirname, 'dist', 'picimo.mjs.map'),
      format: 'esm',
    },
    plugins: [
      plugins.banner,
      babel({
        exclude: [
          /node_modules/,
        ],
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'entry',
              targets: {
                esmodules: true,
              },
            },
          ],
        ],
      }),
      plugins.commonjs,
      plugins.resolve,
      plugins.replace,
      sizeSnapshot({ snapshotPath: '.size-snapshot__picimo_mjs.json' }),
      plugins.terser,
    ],
  },
];

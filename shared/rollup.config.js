import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default ({ root, filename, external }) => ({
  external,
  input: 'src/index.js',
  output: {
    file: path.join(root, 'dist', `${filename}.js`),
    sourcemap: true,
    sourcemapFile: path.join(root, 'dist', `${filename}.js.map`),
    format: 'es',
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
    terser(),
  ],
});

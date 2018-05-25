// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
// import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  external: [
    'gl-matrix',
  ],
  plugins: [
    /*
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/env', {
            modules: false,
          },
        ],
      ],
    }),
    */
    commonjs(),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
  ],
};

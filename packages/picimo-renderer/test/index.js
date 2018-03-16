/* global mocha */
import '@babel/polyfill';
import 'mocha/mocha';

mocha.setup({
  ui: 'bdd',
  noHighlighting: true,
});

require('../src/WebGlRenderer.spec');
require('../src/WebGlResourceLibrary.spec');
require('../src/WebGlProgram.spec');

mocha.checkLeaks();
mocha.run();

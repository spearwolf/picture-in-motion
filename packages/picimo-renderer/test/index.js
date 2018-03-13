/* global mocha */
import '@babel/polyfill';
import 'mocha/mocha';

mocha.setup({
  ui: 'bdd',
  noHighlighting: true,
});

require('../src/WebGlRenderer/WebGlRenderer.spec');
require('../src/WebGlResourceLibrary/WebGlResourceLibrary.spec');

mocha.checkLeaks();
mocha.run();

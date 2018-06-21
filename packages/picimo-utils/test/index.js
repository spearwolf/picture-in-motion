/* global mocha */
import '@babel/polyfill';
import 'mocha/mocha';

mocha.setup({
  ui: 'bdd',
  noHighlighting: true,
});

require('../src/findNextPowerOf2.spec.js');
require('../src/isPowerOf2.spec.js');
require('../src/maxOf.spec.js');
require('../src/pick.spec.js');
require('../src/get.spec.js');

mocha.checkLeaks();
mocha.run();

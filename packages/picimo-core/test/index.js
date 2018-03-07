/* global mocha */
import '@babel/polyfill';
import 'mocha/mocha';

mocha.setup({
  ui: 'bdd',
  noHighlighting: true,
});

require('../src/AABB2.spec.js');
require('../src/findNextPowerOf2.spec.js');
require('../src/isPowerOf2.spec.js');
require('../src/maxOf.spec.js');
require('../src/ResourceRef.spec.js');
require('../src/Serial.spec.js');
require('../src/StackedContext.spec.js');
require('../src/Viewport.spec.js');
require('../src/VOArray.spec.js');

mocha.checkLeaks();
mocha.run();

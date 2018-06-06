/* global mocha */
import '@babel/polyfill';
import 'mocha/mocha';

mocha.setup({
  ui: 'bdd',
  noHighlighting: true,
});

require('../src/Context.spec');
require('../src/Context.SpriteGroup.spec');
require('../src/picimoParser.spec');

mocha.checkLeaks();
mocha.run();

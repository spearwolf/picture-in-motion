/* global mocha */
import '@babel/polyfill';
import 'mocha/mocha';

mocha.setup({
  ui: 'bdd',
  noHighlighting: true,
});

require('../src/ECS.spec');
require('../src/components/ChildrenComponent.spec');
require('../src/getComponentName.spec');

mocha.checkLeaks();
mocha.run();

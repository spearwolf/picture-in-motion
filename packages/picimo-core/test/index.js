/* global mocha */
import '@babel/polyfill';
import 'mocha/mocha';

mocha.setup({
  ui: 'bdd',
  noHighlighting: true,
});

require('../src/AABB2.spec.js');
require('../src/DataRef.spec.js');
require('../src/ElementIndexArray.spec.js');
require('../src/findNextPowerOf2.spec.js');
require('../src/isPowerOf2.spec.js');
require('../src/maxOf.spec.js');
require('../src/pick.spec.js');
require('../src/PowerOf2Image.spec.js');
require('../src/Projection.spec.js');
require('../src/ProjectionUniform.spec.js');
require('../src/ShaderContext.spec.js');
require('../src/ShaderSource.spec.js');
require('../src/ShaderVariable.spec.js');
require('../src/SpriteGroup.spec.js');
require('../src/StackedContext.spec.js');
require('../src/Texture.spec.js');
require('../src/TextureAtlas.spec.js');
require('../src/Viewport.spec.js');
require('../src/VOArray.spec.js');
require('../src/VODescriptor/VODescriptor.spec.js');
require('../src/VOPool/VOPool.spec.js');

mocha.checkLeaks();
mocha.run();

/* eslint-env mocha */
/* eslint no-param-reassign: 0 */
import assert from 'assert';

import {
  SpriteGroup,
  TextureLibrary,
  VODescriptor,
} from '.';

describe('SpriteGroup', () => {
  const textureLibrary = new TextureLibrary();
  const voDescriptor = new VODescriptor({
    vertexCount: 4,
    attributes: [{
      name: 'position',
      type: 'int32',
      size: 2,
      attrNames: ['x', 'y'],
    }, {
      name: 'texCoords',
      type: 'int32',
      size: 2,
      attrNames: ['s', 't'],
      uniform: true,
    }],
  });

  it('should be instancable without options', () => {
    const sg = new SpriteGroup(voDescriptor, textureLibrary);
    assert.strictEqual(sg.descriptor, voDescriptor, 'descriptor should be set as property');
    assert.strictEqual(sg.textureLibrary, textureLibrary, 'textureLibrary should be set as property');
    assert.ok(sg.capacity > 0, 'capacity should be greater than 0');
    assert.strictEqual(sg.usedCount, 0, 'usedCount should be 0 after initialization');
    assert.strictEqual(sg.availableCount, sg.capacity, 'availableCount should be equal to capacity');
  });

  describe('voNew and voZero initialize', () => {
    it('init with an object', () => {
      const sg = new SpriteGroup(voDescriptor, textureLibrary, {
        voNew: {
          x0: 16,
          y1: 32,
          texCoords: [4, 8],
        },
      });
      const sprite = sg.createSprite();
      assert.ok(sprite);
      assert.strictEqual(sprite.x0, 16);
      assert.strictEqual(sprite.y1, 32);
      assert.strictEqual(sprite.s, 4);
      assert.strictEqual(sprite.t, 8);
    });

    it('init with a function', () => {
      const sg = new SpriteGroup(voDescriptor, textureLibrary, {
        voNew: (vo) => {
          vo.x1 = 17;
          vo.y3 = 66;
        },
      });
      const sprite = sg.createSprite();
      assert.ok(sprite);
      assert.strictEqual(sprite.x1, 17);
      assert.strictEqual(sprite.y3, 66);
    });
  });
});

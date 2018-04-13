/* eslint-env mocha */
/* eslint no-param-reassign: 0 */
import assert from 'assert';

import TexturedSpriteGroup from './TexturedSpriteGroup';

import {
  VODescriptor,
  IndexedPrimitive,
} from '.';

describe('TexturedSpriteGroup', () => {
  const voDescriptor = new VODescriptor({
    vertexCount: 4,

    attributes: [{
      name: 'position',
      type: 'int32',
      size: 2,
      attrNames: ['x', 'y'],
    }, {
      name: 'size',
      type: 'int32',
      size: 2,
      attrNames: ['w', 'h'],
    }, {
      name: 'texCoords',
      type: 'int32',
      attrNames: ['s', 't'],
      uniform: true,
    }],

    proto: {
      setTexCoordsByTexture(t) {
        this.w = t.width;
        this.h = t.height;
      },
    },
  });

  it('should be instancable without options', () => {
    const sg = new TexturedSpriteGroup(voDescriptor, IndexedPrimitive.createQuads);
    assert.strictEqual(sg.descriptor, voDescriptor, 'descriptor should be set as property');
    assert.ok(sg.textureLibrary, 'should have a .textureLibrary');
    assert.ok(sg.capacity > 0, 'capacity should be greater than 0');
    assert.strictEqual(sg.usedCount, 0, 'usedCount should be 0 after initialization');
    assert.strictEqual(sg.availableCount, sg.capacity, 'availableCount should be equal to capacity');
  });

  describe('loadTextureAtlas', () => {
    it('createSprite() should set size and texCoords', async () => {
      const sg = new TexturedSpriteGroup(voDescriptor, IndexedPrimitive.createQuads, { capacity: 10 });
      const atlas = await sg.loadTextureAtlas('tex', '/assets/nobinger.json');
      const sprite = sg.createSprite(atlas.frame('nobinger-rot.png'));
      assert.ok(sprite);
      assert.strictEqual(sprite.w, 55);
      assert.strictEqual(sprite.h, 61);
    });
  });
});

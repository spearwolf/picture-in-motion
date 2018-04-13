/* eslint-env mocha */
/* eslint no-param-reassign: 0 */
import assert from 'assert';

import SpriteGroup from './SpriteGroup';

import {
  VODescriptor,
  IndexedPrimitive,
} from '.';

describe('SpriteGroup', () => {
  const voDescriptor = new VODescriptor({
    vertexCount: 4,
    attributes: [{
      name: 'position',
      type: 'int32',
      size: 2,
      scalars: ['x', 'y'],
    }, {
      name: 'size',
      type: 'int32',
      size: 2,
      scalars: ['w', 'h'],
      uniform: true,
    }],
  });

  it('should be instancable without options', () => {
    const sg = new SpriteGroup(voDescriptor, IndexedPrimitive.createQuads);
    assert.strictEqual(sg.descriptor, voDescriptor, 'descriptor should be set as property');
    assert.ok(sg.capacity > 0, 'capacity should be greater than 0');
    assert.strictEqual(sg.usedCount, 0, 'usedCount should be 0 after initialization');
    assert.strictEqual(sg.availableCount, sg.capacity, 'availableCount should be equal to capacity');
  });

  describe('voNew and voZero initialize', () => {
    it('init with an object', () => {
      const sg = new SpriteGroup(voDescriptor, IndexedPrimitive.createQuads, {
        capacity: 10,
        voNew: {
          x0: 16,
          y1: 32,
        },
      });
      const sprite = sg.createSprite();
      assert.ok(sprite);
      assert.strictEqual(sprite.x0, 16, 'sprite.x0');
      assert.strictEqual(sprite.y1, 32, 'sprite.y0');
    });

    it('init with a function', () => {
      const sg = new SpriteGroup(voDescriptor, IndexedPrimitive.createQuads, {
        capacity: 10,
        voNew: (vo) => {
          vo.x1 = 17;
          vo.y3 = 66;
        },
      });
      const sprite = sg.createSprite();
      assert.ok(sprite, 'sprite should be created');
      assert.strictEqual(sprite.x1, 17, 'sprite.x1');
      assert.strictEqual(sprite.y3, 66, 'sprite.y3');
    });
  });

  describe('setSpriteSize', () => {
    it('attribute name', () => {
      const sg = new SpriteGroup(voDescriptor, IndexedPrimitive.createQuads, {
        capacity: 10,
        setSpriteSize: 'size',
      });
      const sprite = sg.createSprite(44, 88);
      assert.strictEqual(sprite.w, 44);
      assert.strictEqual(sprite.h, 88);
    });

    it('function', () => {
      const sg = new SpriteGroup(voDescriptor, IndexedPrimitive.createQuads, {
        capacity: 10,
        setSpriteSize: (sprite, w, h) => sprite.setSize(w + 1, h + 2),
      });
      const sprite = sg.createSprite(44, 88);
      assert.strictEqual(sprite.w, 45);
      assert.strictEqual(sprite.h, 90);
    });
  });
});

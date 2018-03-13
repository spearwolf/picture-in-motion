/* eslint-env browser */
/* eslint-env mocha */
import { assert } from 'chai';
import { ElementIndexArray } from '@picimo/core'; // eslint-disable-line

import WebGlBuffer from '../WebGlBuffer';
import WebGlRenderer from '../WebGlRenderer';
import WebGlResourceLibrary from './WebGlResourceLibrary';

describe('WebGlResourceLibrary', () => {
  let container;
  let renderer;

  before(() => {
    container = document.createElement('div');
    container.style.width = '320px';
    container.style.height = '240px';
    document.body.appendChild(container);
    renderer = new WebGlRenderer(container);
  });

  after(() => {
    document.body.removeChild(container);
  });

  it('renderer has a resource library', () => {
    assert.exists(renderer.resources);
    assert.instanceOf(renderer.resources, WebGlResourceLibrary, 'renderer.resources is a instance of WebGlResourceLibrary');
  });

  describe('Resource: ElementIndexArray', () => {
    const quadIndices = ElementIndexArray.Generate(10, [0, 1, 2, 0, 2, 3], 4, 0, 'dynamic');

    it('loadBuffer()', () => {
      const ref = renderer.resources.loadBuffer(quadIndices);
      assert.strictEqual(ref.type, 'WebGlBuffer', 'dataRef.type should be "WebGlBuffer"');
      assert.instanceOf(ref.data, WebGlBuffer, 'dataRef.data should be an instance of WebGlBuffer');
      assert.strictEqual(ref.id, quadIndices.ref.id, 'dataRef.id should be equals to ElementIndexArray.ref.id');
      assert.strictEqual(ref.serial, 0, 'dataRef.serial should be initially set to 0');
      assert.strictEqual(ref.data.usage, renderer.glx.gl.DYNAMIC_DRAW, 'usage hint should be "dynamic"');
    });

    it('findBuffer()', () => {
      const ref = renderer.resources.findBuffer(quadIndices.ref);
      assert.strictEqual(ref.type, 'WebGlBuffer', 'dataRef.type should be "WebGlBuffer"');
      assert.strictEqual(ref.id, quadIndices.ref.id, 'dataRef.id should be equals to ElementIndexArray.ref.id');
    });

    it('gl.isBuffer()', () => {
      const ref = renderer.resources.findBuffer(quadIndices.ref);
      ref.data.bufferData();
      assert.isTrue(renderer.glx.gl.isBuffer(ref.data.glBuffer));
    });

    it('freeBuffer()', () => {
      const { glBuffer } = renderer.resources.findBuffer(quadIndices.ref).data;
      renderer.resources.freeBuffer(quadIndices.ref);
      const ref = renderer.resources.findBuffer(quadIndices.ref);
      assert.notExists(ref);
      assert.isFalse(renderer.glx.gl.isBuffer(glBuffer));
    });
  });
});

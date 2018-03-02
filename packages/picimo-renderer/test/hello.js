/* eslint-env browser */
/* eslint-env mocha */
import { assert } from 'chai';
import { WebGlRenderer } from '../src';

describe('WebGlRenderer', () => {
  it('create with <canvas> element', () => {
    const canvas = document.createElement('canvas');
    const r = new WebGlRenderer(canvas, { foo: 'plah!' });
    assert.strictEqual(r.domElement, canvas, 'WebGlRenderer.domElement');
    assert.strictEqual(r.canvas, canvas, 'WebGlRenderer.canvas');
    assert.strictEqual(r.gl, 'foo!', 'WebGlRenderer.gl');
  });
});

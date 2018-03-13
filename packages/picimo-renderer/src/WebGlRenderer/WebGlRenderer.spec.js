/* eslint-env browser */
/* eslint-env mocha */
import { assert } from 'chai';
import WebGlRenderer from './WebGlRenderer';

describe('WebGlRenderer', () => {
  describe('with a predefined <canvas> element as first argument passed to constructor', () => {
    it('create instance', () => {
      const canvas = document.createElement('canvas');
      const r = new WebGlRenderer(canvas, { foo: 'bar' });
      assert.strictEqual(r.domElement, canvas, 'domElement');
      assert.strictEqual(r.canvas, canvas, 'canvas');
      assert.exists(r.glx, 'glx (webgl context)');
      assert.strictEqual(r.now, 0, 'now');
      assert.strictEqual(r.frameNo, 0, 'frameNo');
      assert.strictEqual(r.timeFrameOffset, 0, 'timeFrameOffset');
    });

    describe('while <canvas> is not attached to document', () => {
      it('shoud have a size greater than 0x0', () => {
        const canvas = document.createElement('canvas');
        const r = new WebGlRenderer(canvas);
        assert.isAbove(r.width, 0, 'width');
        assert.isAbove(r.height, 0, 'height');
      });
    });

    describe('while <canvas> is appended as child to document.body', () => {
      it('shoud have the same size as document.body', () => {
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        const r = new WebGlRenderer(canvas);
        const dpr = window.devicePixelRatio || 1;
        const { clientWidth, clientHeight } = document.body;
        assert.strictEqual(r.width, clientWidth * dpr, 'width');
        assert.strictEqual(r.height, clientHeight * dpr, 'height');
        assert.isAbove(r.width, 0, 'width should be greater than 0');
        assert.isAbove(r.height, 0, 'height should be greater than 0');
        document.body.removeChild(canvas);
      });
    });
  });

  describe('with a <div> as container element as first argument passed to constructor', () => {
    it('should create a new <canvas> and append it to the container', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const r = new WebGlRenderer(container);
      assert.exists(r.canvas);
      assert.notEqual(r.canvas, container, 'canvas and container/domElement should not be the same');
      assert.strictEqual(r.canvas.parentNode, container, 'canvas should be a child of the container');

      document.body.removeChild(container);
    });

    it('calling resize() should set our canvas to the same size as the container element', () => {
      const container = document.createElement('div');
      container.style.width = '320px';
      container.style.height = '240px';
      document.body.appendChild(container);

      const r = new WebGlRenderer(container);

      const dpr = window.devicePixelRatio || 1;
      assert.strictEqual(r.width, 320 * dpr, 'width');
      assert.strictEqual(r.height, 240 * dpr, 'height');
      assert.isAbove(r.width, 0, 'width should be greater than 0');
      assert.isAbove(r.height, 0, 'height should be greater than 0');

      container.style.width = '400px';
      container.style.height = '300px';

      r.resize();

      assert.strictEqual(r.width, 400 * dpr, 'width');
      assert.strictEqual(r.height, 300 * dpr, 'height');

      document.body.removeChild(container);
    });
  });
});

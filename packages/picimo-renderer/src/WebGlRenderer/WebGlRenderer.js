/* eslint-env browser */
import { readOption } from '@picimo/core'; // eslint-disable-line

import createCanvas from './createCanvas';
import createGl from './createGl';

/**
 * The WebGL renderer.
 */
export default class WebGlRenderer {
  /**
   * @param {HTMLElement} domElement - The `<canvas>` element or the *container* element.
   * @param {Object} [options]
   * @param {number} [options.pixelRatio] - Set `pixelRatio` to a fixed value instead of reading from `window.devicePixelRatio` (default)
   */
  constructor(domElement, options) {
    /**
     * The `<canvas>` or the *container* element / that's the first argument you passed to the constructor
     */
    this.domElement = domElement;

    /**
     * The `<canvas>` element
     */
    this.canvas = createCanvas(domElement);

    /**
     * WebGL context
     */
    this.gl = createGl(this.canvas, options);

    /**
     * Time in *seconds*
     */
    this.now = 0;

    /**
     * The time in *seconds* as it was at the last call of `render()`
     */
    this.lastFrameTime = 0;

    /**
     * Current frame number (initially set to 0)
     */
    this.frameNo = 0;

    /**
     * Seconds that have passed since the last rendering / that's the last call to `render()`
     */
    this.timeFrameOffset = 0;

    /**
     * @private
     */
    this._pixelRatio = readOption(options, 'pixelRatio');

    this.resize();
  }

  /**
   * The *pixel ratio* used to calculate the *webgl canvas* width and height.
   */
  get pixelRatio() {
    return this._pixelRatio || window.devicePixelRatio || 1;
  }

  /**
   * Resize the *webgl canvas* according to the `<canvas>` styles.
   */
  resize() {
    const { canvas, domElement } = this;
    const style = window.getComputedStyle(canvas, null);
    const isInline = style.display === 'inline' || style.display === '';

    const el = isInline && domElement === canvas ? domElement.parentNode : domElement;

    const {
      clientWidth: wPx,
      clientHeight: hPx,
    } = el || {
      clientWidth: canvas.width,
      clientHeight: canvas.height,
    };

    canvas.style.width = `${wPx}px`;
    canvas.style.height = `${hPx}px`;

    const dpr = this.pixelRatio;
    const w = Math.round(wPx * dpr);
    const h = Math.round(hPx * dpr);

    if (w !== canvas.width || h !== canvas.height) {
      canvas.width = w;
      canvas.height = h;
    }

    if (w !== this.width || h !== this.height) {
      /**
       * The width in *pixels* of the *webgl canvas*
       */
      this.width = w;

      /**
       * The height in *pixels* of the *webgl canvas*
       */
      this.height = h;
    }
  }

  /**
   * Returns the current content of our *webgl canvas* as ImageData object.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ImageData
   * @param {boolean} [flipY=false] - flip image vertically
   * @returns {ImageData}
   */
  readPixels(flipY = false) {
    const { gl } = this;
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const data = new Uint8Array(width * height * 4);

    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

    if (flipY) {
      // https://stackoverflow.com/a/41971402
      Array
        .from({ length: height }, (val, i) => data.slice(i * width * 4, (i + 1) * width * 4))
        .forEach((val, i) => data.set(val, (height - i - 1) * width * 4));
    }

    return new ImageData(Uint8ClampedArray.from(data), width, height);
  }

  /**
   * @desc
   * Render a single frame.
   * Every call to `render()` will increase the `frameNo` counter.
   *
   * @param {number} [now] - *now* in *millis*. is read out from `performance.now()` by default
   */
  render(now = window.performance.now()) {
    ++this.frameNo;

    this.now = now / 1000.0; // seconds
    if (this.frameNo !== 1) {
      this.timeFrameOffset = this.now - this.lastFrameTime;
    }
    this.lastFrameTime = this.now;
  }
}

/* eslint-env browser */
import {
  readOption,
  ShaderContext,
  ShaderUniformVariable,
} from '@picimo/core'; // eslint-disable-line

import { createWebGlContext } from './WebGlContext';

import WebGlResourceLibrary from './WebGlResourceLibrary';

/** @private */
const createCanvas = (domElement) => {
  if (domElement.tagName === 'CANVAS') {
    return domElement;
  }

  const canvas = document.createElement('canvas');
  domElement.appendChild(canvas);
  return canvas;
};

/** @private */
const autotouchResource = (ref, autotouchedResources) => {
  if (!autotouchedResources.has(ref.id)) {
    autotouchedResources.add(ref.id);
    ref.touch();
  }
};

/**
 * The *main* WebGL renderer.
 */
export default class WebGlRenderer {
  /**
   * @param {HTMLElement} domElement - The `<canvas>` or the *container* element.
   * @param {Object} [options]
   * @param {number} [options.pixelRatio] - Set `pixelRatio` to a fixed value instead of reading from `window.devicePixelRatio` (default)
   * @param {number} [options.disableWebGL2] - Set to `true` if you want to force a WebGL1 context instead of an WebGL2 (default if possible)
   */
  constructor(domElement, options) {
    /**
     * The `<canvas>` or the *container* element.
     */
    this.domElement = domElement;

    /**
     * The `<canvas>` element.
     */
    this.canvas = createCanvas(domElement);

    /**
     * WebGL context.
     */
    this.glx = createWebGlContext(this.canvas, options);

    /**
     * @type {WebGlResourceLibrary}
     */
    this.resources = new WebGlResourceLibrary(this.glx);

    /**
     * The global shader variable context.
     * @type {ShaderContext}
     */
    this.shaderContext = new ShaderContext();

    /**
     * Time in *seconds*.
     */
    this.now = 0;

    /**
     * The time in *seconds* as it was at the last call of `initFrame()`.
     */
    this.lastFrameTime = 0;

    /**
     * Current frame number. Initially set to 0.
     */
    this.frameNo = 0;

    /**
     * Seconds passed since the last render / previous call to `initFrame()`.
     */
    this.timeFrameOffset = 0;

    /**
     * Force set *pixel ratio* to a custom value.
     * @private
     */
    this._pixelRatio = readOption(options, 'pixelRatio');

    /**
     * Will be cleared on each frame. Holds `id`'s of all autotouch'd resources (within the current frame).
     * @private
     */
    this._autotouchedResources = new Set();

    this.shaderGlobals = {
      time: new ShaderUniformVariable('time', 0),
      resolution: new ShaderUniformVariable('resolution', [0, 0]),
    };

    this.resize();
  }

  /**
   * The *pixel ratio* used to calculate the canvas *pixels*. Default is read from `window.devicePixelRatio`.
   */
  get pixelRatio() {
    return this._pixelRatio || window.devicePixelRatio || 1;
  }

  /**
   * Resize the webgl canvas according to the `<canvas>` styles.
   * If the canvas has an explicit container element (given as the first constructor argument),
   * the size is determinated by the container element styles.
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
       * The width in *pixels* of our webgl canvas.
       */
      this.width = w;

      /**
       * The height in *pixels* of out webgl canvas.
       */
      this.height = h;

      this.shaderGlobals.resolution.data = [w, h];
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
   * Initialize the *renderer state* for the next frame.
   *
   * Each call to `initFrame()` will ..
   * 1. increase the frame number `frameNo`
   * 2. update the frame *time* (`now`, `lastFrameTime` and `shaderGlobals`:uniform:`time`)
   * 3. initialize shader variable context
   * 4. set the webgl viewport (to full canvas size)
   *
   * @param {number} [now] - *now* in *millis*. Is read out from `performance.now()` if not specified.
   */
  initFrame(now = window.performance.now()) {
    // 1) increase frame number
    ++this.frameNo;

    // 2) update frame time
    this.now = now / 1000.0; // seconds
    if (this.frameNo !== 1) {
      this.timeFrameOffset = this.now - this.lastFrameTime;
    }
    this.lastFrameTime = this.now;
    this.shaderGlobals.time.data = this.now;

    // -) reset internal frame context
    this._autotouchedResources.clear();

    // 3) initialize shader variable context
    this.shaderContext.clear();
    Object.values(this.shaderGlobals).forEach((shaderVar) => {
      this.shaderContext.pushVar(shaderVar);
    });

    // 4) set webgl viewport
    this.glx.gl.viewport(0, 0, this.width, this.height);
  }

  /**
   * @param {VOArray|ElementIndexArray} - The buffer resource
   * @return {WebGlBuffer}
   */
  syncBuffer({ ref }) {
    if (ref.hasHint('autotouch', true)) {
      autotouchResource(ref, this._autotouchedResources);
    }

    const bufferRef = this.resources.loadBuffer(ref);

    bufferRef.sync(ref, (buffer) => {
      if (ref.hasHint('doubleBuffer', true)) {
        buffer.doubleBufferData();
      } else {
        buffer.bufferData();
      }
    });

    return bufferRef.data;
  }

  /**
   * @param {Texture} texture
   * @return {WebGlTexture}
   */
  syncTexture(texture) {
    const texRef = texture.ref;
    const glTexRef = this.resources.loadTexture(texRef);
    glTexRef.sync(texRef, tex => tex.uploadImageData());
    return glTexRef.data;
  }

  /**
   * @param {ShaderProgram} shaderProgram
   */
  useShaderProgram(shaderProgram) {
    const program = this.resources.loadProgram(shaderProgram);
    const { shaderContext } = this;
    const success = program.use();
    const successUniforms = program.loadUniforms(shaderContext, this);
    const successAttributes = program.loadAttributes(shaderContext, this);
    return success && successUniforms && successAttributes;
  }
}
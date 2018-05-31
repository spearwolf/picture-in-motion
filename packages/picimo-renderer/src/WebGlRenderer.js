/* eslint-env browser */
import {
  Projection,
  ShaderContext,
  ShaderUniformGroup,
  StackedContext,
  TexturedSpriteGroup,
  readOption,
} from '@picimo/core'; // eslint-disable-line

import { createWebGlContext } from './WebGlContext';
import WebGlResourceLibrary from './WebGlResourceLibrary';
import BlendMode from './BlendMode';

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

/** @private */
const applyBlendMode = (renderer) => {
  const blendMode = renderer.universalContext.get('blend');
  if (blendMode) {
    renderer.glx.blend(blendMode);
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

    this.universalContext = new StackedContext();

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

    this.shaderGlobals = new ShaderUniformGroup({
      time: 0,
      resolution: [0, 0],
      projection: new Projection({ pixelRatio: 1 }),
    });

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

      this.shaderGlobals.resolution = [w, h];
      this.shaderGlobals.projectionUniform.update(w, h);
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
   * 3. initialize shader variable context (time, resolution, projection, ..)
   * 4. initialize universal context (blend, ..)
   * 5. set the webgl viewport (to full canvas size)
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
    this.shaderGlobals.time = this.now;

    // -) reset internal frame context
    this._autotouchedResources.clear();

    // 3) initialize universal context
    this.universalContext.clear();
    this.universalContext.push('blend', BlendMode.make('orderDependent'));

    // 4) initialize shader variable context
    this.shaderContext.clear();
    this.shaderGlobals.pushVar(this.shaderContext);

    // 5) set webgl viewport
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

  /**
   * @param {string} primitive
   * @param {number} count
   * @param {number} [startIndex=0]
   */
  drawArrays(primitive, count, startIndex = 0) {
    applyBlendMode(this);

    const { gl } = this.glx;
    gl.drawArrays(gl[primitive], startIndex, count);
  }

  /**
   * @param {string} primitive
   * @param {ElementIndexArray} elementIndexArray
   * @param {number} [count]
   * @param {number} [offset=0]
   */
  drawIndexed(primitive, elementIndexArray, count, offset = 0) {
    applyBlendMode(this);
    this.syncBuffer(elementIndexArray).bindBuffer();

    const { gl } = this.glx;
    gl.drawElements(
      gl[primitive],
      count || elementIndexArray.length,
      gl.UNSIGNED_SHORT,
      offset * elementIndexArray.array.BYTES_PER_ELEMENT,
    );
  }

  /**
   * @param {string} primitive
   * @param {ElementIndexArray} elementIndexArray
   * @param {number} count
   * @param {number} offset=0
   * @param {number} instanceCount
   */
  drawIndexedInstanced(primitive, elementIndexArray, count, offset, instanceCount) {
    applyBlendMode(this);
    this.syncBuffer(elementIndexArray).bindBuffer();

    const { glx } = this;
    const { gl } = glx;
    glx.drawElementsInstanced(
      gl[primitive],
      count || elementIndexArray.length,
      gl.UNSIGNED_SHORT,
      offset * elementIndexArray.array.BYTES_PER_ELEMENT,
      instanceCount,
    );
  }

  /**
   * @param {IndexedPrimitive} indexedPrimitive
   * @param {number} [primCount]
   * @param {number} [primOffset=0]
   */
  drawPrimitive({ primitiveType, elementIndexArray }, primCount, primOffset) {
    const { itemCount } = elementIndexArray;
    this.drawIndexed(primitiveType, elementIndexArray, primCount * itemCount, primOffset * itemCount);
  }

  /**
   * @param {SpriteGroup} spriteGroup
   */
  drawSpriteGroup(spriteGroup) {
    if (spriteGroup instanceof TexturedSpriteGroup) {
      spriteGroup.whenTexturesLoaded((texUniforms) => {
        this.syncBuffer(spriteGroup.voPool.voArray);
        this.shaderContext.pushVar(texUniforms);
        this.shaderContext.pushVar(spriteGroup.voPoolShaderAttribs);
        this.useShaderProgram(spriteGroup.shaderProgram);
        this.drawPrimitive(spriteGroup.primitive, spriteGroup.usedCount, 0);
      });
    } else {
      this.syncBuffer(spriteGroup.voPool.voArray);
      this.shaderContext.pushVar(spriteGroup.voPoolShaderAttribs);
      this.useShaderProgram(spriteGroup.shaderProgram);
      this.drawPrimitive(spriteGroup.primitive, spriteGroup.usedCount, 0);
    }
  }
}

/* eslint-env browser */
/* eslint no-underscore-dangle: 0 */
/* eslint no-nested-ternary: 0 */
import { readOption } from '@picimo/utils'; // eslint-disable-line

import DataRef from './DataRef';
import PowerOf2Image from './PowerOf2Image';

/**
 * Represents texture coordinates and holds a reference to an `<img>` or `<canvas>` element.
 * Textures can form hierachical structures:
 * The *root* texture contains always the image reference, all other *sub* textures contain
 * references to their parent (and the root).
 *
 * @class Texture
 *
 * @example
 * const canvas = document.createElement("canvas")
 * const texture = new Texture(canvas)
 * texture.width    // => 300 <- default size of <canvas> element
 * texture.height   // => 150
 *
 * let subTex = new Texture(texture, 30, 15, 100, 100)
 * subTex.width    // => 100
 *
 * Texture.load('test/assets/bird-chicken-penguin.png').then(tex => {
 *   tex.width    // => 640
 *   tex.height   // => 480
 * })
 */

export default class Texture {
  /**
   * @param {Texture|PowerOf2Image|HTMLImageElement|HTMLCanvasElement} source - image elements must be *completed* (loaded)
   * @param {number} [width]
   * @param {number} [height]
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {Object} [hints] texture hints
   * @param {boolean} [hints.flipY=false]
   * @param {boolean} [hints.repeatable=false]
   * @param {boolean} [hints.premultiplyAlpha=true]
   * @param {boolean} [hints.nearest=true]
   */
  constructor(source, width, height, x = 0, y = 0, hints = undefined) {
    let width_ = width;
    let height_ = height;

    if (source instanceof Texture) {
      /**
       * @type {Texture}
       */
      this.parent = source;
      /**
       * @type {PowerOf2Image|HTMLImageElement|HTMLCanvasElement}
       */
      this.image = null;
    } else if (typeof source === 'object' && 'width' in source && 'height' in source) {
      this.image = source;
      this.parent = null;

      this._ref = new DataRef('Texture', this, {
        flipY: readOption(hints, 'flipY', false),
        repeatable: readOption(hints, 'repeatable', false),
        premultiplyAlpha: readOption(hints, 'premultiplyAlpha', true),
        nearest: readOption(hints, 'nearest', true),
      });

      if ('origWidth' in source && 'origHeight' in source) {
        width_ = source.origWidth;
        height_ = source.origHeight;
      }
    } else {
      throw new Error('new Texture() panic: unexpected source argument!');
    }

    this._width = width_;
    this._height = height_;

    /**
     * @type {number}
     */
    this.x = x;
    /**
     * @type {number}
     */
    this.y = y;
  }

  /**
   * @type {Texture}
   */
  get root() {
    return (this.parent && this.parent.root) || this;
  }

  /**
   * @type {HTMLImageElement|HTMLCanvasElement}
   */
  get imgEl() {
    const { root } = this;
    return root.image.imgEl || root.image;
  }

  /**
   * @type {ResourceRef}
   */
  get ref() {
    return this._ref || this.root.ref;
  }

  /**
   * @type {number}
   */
  get width() {
    return (typeof this._width === 'number'
      ? this._width
      : (this.image
        ? this.image.width
        : (this.parent
          ? this.root.width
          : 0
        )
      )
    );
  }

  set width(w) {
    this._width = w;
  }

  /**
   * @type {number}
   */
  get height() {
    return (typeof this._height === 'number'
      ? this._height
      : (this.image
        ? this.image.height
        : (this.parent
          ? this.root.height
          : 0
        )
      )
    );
  }

  set height(h) {
    this._height = h;
  }

  /**
   * @type {number}
   */
  get minS() {
    let { x } = this;
    let texture = this;

    while ((texture = texture.parent) != null) {  // eslint-disable-line
      x += texture.x;
    }

    return x / this.root.image.width;
  }

  /**
   * @type {number}
   */
  get minT() {
    let { y } = this;
    let texture = this;

    while ((texture = texture.parent) != null) {  // eslint-disable-line
      y += texture.y;
    }

    return y / this.root.image.height;
  }

  /**
   * @type {number}
   */
  get maxS() {
    let x = this.x + this.width;
    let texture = this;

    while ((texture = texture.parent) != null) {  // eslint-disable-line
      x += texture.x;
    }

    return x / this.root.image.width;
  }

  /**
   * @type {number}
   */
  get maxT() {
    let y = this.y + this.height;
    let texture = this;

    while ((texture = texture.parent) != null) {  // eslint-disable-line
      y += texture.y;
    }

    return y / this.root.image.height;
  }

  /**
    * Loads an image from url and returns a texture.
    * @param {string} url
    * @param {object} [textureHints]
    * @returns {Promise<Texture>}
    */
  static async load(url, textureHints) {
    const absoluteUrl = new URL(url, window.location.href).href;
    const p2img = await new PowerOf2Image(absoluteUrl).onLoaded;
    return new Texture(p2img, undefined, undefined, 0, 0, textureHints);
  }
}

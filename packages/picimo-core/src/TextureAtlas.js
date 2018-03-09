/* eslint-env browser */
import Texture from './Texture';
import TextureAtlasJsonDef from './TextureAtlasJsonDef';
import PowerOf2Image from './PowerOf2Image';
import sample from './sample';
import readOption from './readOption';

/**
  * @example
  * TextureAtlas.load('nobinger.json').then(atlas => {
  *   const blau = atlas.frame('nobinger-blau.png')
  *   blau.width   # => 55
  *   blau.height  # => 61
  * })
  */
export default class TextureAtlas {
  /**
   * @param {Texture} rootTexture
   * @param {TextureAtlasSpec} [jsonDef=null]
   */
  constructor(rootTexture, jsonDef = null) {
    /**
     * @type {Texture}
     */
    this.rootTexture = rootTexture;
    /**
     * @type {TextureAtlasSpec}
     */
    this.jsonDef = jsonDef;
    /**
     * @type {Map<string,Texture>}
     */
    this.frames = new Map();
  }

  /**
   * @param {string} name
   * @param {number} width
   * @param {number} height
   * @param {number} x
   * @param {number} y
   */
  addFrame(name, width, height, x, y) {
    this.frames.set(name, new Texture(this.rootTexture, width, height, x, y));
  }

  /**
   * @param {string} alias - new frame name
   * @param {string} frame - original frame name
   */
  addFrameAlias(alias, frame) {
    if (this.frames.has(frame)) {
      this.frames.set(alias, this.frames.get(frame));
    }
  }

  /**
   * @param {string} name
   * @returns {Texture}
   */
  frame(name) {
    return this.frames.get(name);
  }

  /**
   * @returns {Texture}
   */
  randomFrame() {
    return sample(Array.from(this.frames.values()));
  }

  /**
   * @returns {string}
   */
  randomFrameName() {
    return sample(this.frameNames());
  }

  /**
   * @param {string} [match] - optionally regular expression to filter frame names
   * @returns {Array<string>}
   */
  frameNames(match) {
    const frames = Array.from(this.frames.keys());
    if (match) {
      const regex = new RegExp(match);
      return frames.filter(name => regex.test(name));
    }
    return frames;
  }

  /**
   * Loads a TextureAtlas.
   * @param {string} url - should point to the *texture atlas json def*
   * @param {object} [options] - options
   * @param {object} [optons.fetchOptions] - options for the `fetch()` call
   * @param {string|function|PowerOf2Image|HTMLImageElement|HTMLCanvasElement} [options.image] - by default the image will be loaded from url specified by `meta.image` property from the *texture atlas json def*
   * @param {object} [options.textureHints] - texture hints
   * @returns {Promise<TextureAtlas>}
   */
  static async load(url, options) {
    const atlasUrl = new URL(url, window.location.href).href;
    const jsonDef = await TextureAtlasJsonDef.load(atlasUrl, readOption(options, 'fetchOptions'));
    const image = await new PowerOf2Image(readOption(options, 'image', () => new URL(jsonDef.imageUrl, atlasUrl).href, jsonDef)).onLoaded;

    const rootTexture = new Texture(image, undefined, undefined, 0, 0, readOption(options, 'textureHints'));
    const atlas = new TextureAtlas(rootTexture, jsonDef);

    const { frameNames } = jsonDef;
    const len = frameNames.length;
    for (let i = 0; i < len; i++) {
      const name = frameNames[i];
      const { frame } = jsonDef.frames[name];
      atlas.addFrame(name, frame.w, frame.h, frame.x, frame.y);
    }

    return atlas;
  }
}

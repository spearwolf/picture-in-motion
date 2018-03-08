/* eslint-env browser */

/**
 * @private
 */
export default class TextureAtlasJsonDef {
  constructor(jsonDef) {
    this.frameNames = Object.keys(jsonDef.frames);
    this.frames = jsonDef.frames;
    this.meta = jsonDef.meta;
    this.imageUrl = jsonDef.meta.image;
  }

  static async load(url, fetchOptions) {
    const response = await window.fetch(url, fetchOptions);
    const json = await response.json();
    return new TextureAtlasJsonDef(json);
  }
}

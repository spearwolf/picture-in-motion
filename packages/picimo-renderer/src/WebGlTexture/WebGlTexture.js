import initTexGl from './initTexGl';

export default class WebGlTexture {
  /**
   * @param {WebGlContext} glx
   * @param {HTMLImageElement} imgEl
   * @param {boolean} [flipY=false]
   * @param {boolean} [repeatable=false]
   * @param {boolean} [premultiplyAlpha=false]
   * @param {boolean} [nearest=false]
   */
  constructor(glx, imgEl, flipY = false, repeatable = false, premultiplyAlpha = false, nearest = false) {
    this.glx = glx;
    this.imgEl = imgEl;

    this.flipY = flipY;
    this.repeatable = repeatable;
    this.premultiplyAlpha = premultiplyAlpha;
    this.nearest = nearest;

    this.isInitialized = false;
    this.glTexObj = glx.gl.createTexture();
    this.texUnit = -1;
  }

  bind() {
    return this.glx.textureManager.bindWebGlTexture(this);
  }

  uploadImageData() {
    if (this.imgEl == null) return;

    if (!this.isInitialized) {
      initTexGl(this);
      this.isInitialized = true;
    }

    this.bind();

    const { gl } = this.glx;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.imgEl);
  }
}


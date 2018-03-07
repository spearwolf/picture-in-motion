import ShaderVariable from './ShaderVariable';

/**
 * Shader texture 2d variable.
 */
export default class ShaderTexture2dVariable extends ShaderVariable {
  /**
   * @param {string} name
   * @param {number|Object} value
   */
  constructor(name, value) {
    super(name, ShaderVariable.TEXTURE_2D, value);
    this.texture = null;
  }

  /**
   * Sync texture to gpu and update `.value` to the gl texture unit.
   *
   * @param {WebGlRenderer} renderer
   */
  syncTextureAndValue(renderer) {
    // TODO move to @picimo/renderer?
    if (this.texture != null) {
      const glTex = renderer.syncTexture(this.texture);
      this.data = glTex.bind();
    }
  }
}

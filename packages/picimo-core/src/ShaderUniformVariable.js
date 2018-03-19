import ShaderVariable from './ShaderVariable';

/**
 * Shader uniform variable.
 */
export default class ShaderUniformVariable extends ShaderVariable {
  /**
   * @param {string} name
   * @param {number|Object} value
   * @param {*} [origin]
   */
  constructor(name, value, origin) {
    super(name, ShaderVariable.UNIFORM, value);

    this.origin = origin;
  }
}

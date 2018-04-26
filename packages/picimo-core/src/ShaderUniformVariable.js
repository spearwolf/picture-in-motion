import ShaderVariable from './ShaderVariable';

/**
 * Shader uniform variable.
 */
export default class ShaderUniformVariable extends ShaderVariable {
  /**
   * @param {string} name
   * @param {number|Object} value
   * @param {Object} [hints]
   */
  constructor(name, value, hints) {
    super(name, ShaderVariable.UNIFORM, value, hints);
  }
}

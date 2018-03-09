/**
 * Shader attribute variable *alias*.
 * @private
 */
export default class ShaderVariableAlias {
  /**
   * @param {string} name
   * @param {number|Object} value
   */
  constructor(name, shaderVar) {
    this.name = name;
    this.shaderVar = shaderVar;
  }

  get type() {
    return this.shaderVar.type;
  }

  get data() {
    return this.shaderVar.data;
  }

  get serial() {
    return this.shaderVar.serial;
  }
}

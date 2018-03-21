import DataRef from './DataRef';

/**
 * @desc
 * Generic container for *shader variables*.
 *
 * @private
 *
 * A shader variable can be an *uniform*, *vertex attributes* or *textures* ..
 * A shader variable is a `DataRef` but has an additional `name`.
 */
export default class ShaderVariable extends DataRef {
  /**
   * @param {string} name
   * @param {string} type
   * @param {number|Object} value
   * @param {Object} [hints]
   */
  constructor(name, type, value, hints) {
    super(type, value, Object.assign({ serial: 0 }, hints));

    this.name = name;
  }
}

ShaderVariable.UNIFORM = 'uniform';
ShaderVariable.ATTRIB = 'attrib';
ShaderVariable.TEXTURE_2D = 'tex2d';

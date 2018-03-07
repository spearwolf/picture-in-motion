import DataRef from './DataRef';

/**
 * @desc
 * Generic container for *shader variables*.
 *
 * A shader variable can be an *uniform*, *vertex attributes* or *textures* ..
 * A shader variable is a `DataRef` but has an additional `name`.
 */
export default class ShaderVariable extends DataRef {
  /**
   * @param {string} name
   * @param {string} type
   * @param {number|Object} value
   */
  constructor(name, type, value) {
    super(type, value, { serial: 0 });

    this.name = name;
  }
}

ShaderVariable.UNIFORM = 'uniform';
ShaderVariable.ATTRIB = 'attrib';
ShaderVariable.TEXTURE_2D = 'tex2d';

import ShaderVariableGroup from './ShaderVariableGroup';
import ShaderUniformVariable from './ShaderUniformVariable';
import ProjectionUniform from './ProjectionUniform';
import Projection from './Projection';

/**
 * Group of shader uniforms
 */
export default class ShaderUniformGroup extends ShaderVariableGroup {
  constructor(uniforms) {
    super([]);
    Object.keys(uniforms).forEach((name) => {
      this.addUniform(name, uniforms[name]);
    });
  }

  /**
   * @param {string} name
   * @param {number|Object} value
   * @param {Object [hints]
   */
  addUniform(name, value, hints) {
    const isProjection = value instanceof Projection;
    const uniform = isProjection
      ? new ProjectionUniform(value, name)
      : new ShaderUniformVariable(name, value, hints);

    this.shaderVars.push(uniform);

    Object.defineProperty(this, `${name}Uniform`, {
      value: uniform,
      enumerable: true,
    });

    if (isProjection) {
      Object.defineProperty(this, name, {
        enumerable: true,
        get: () => uniform.projection,
      });
    } else {
      Object.defineProperty(this, name, {
        enumerable: true,
        get: () => uniform.data,
        set: (data) => {
          uniform.data = data;
        },
      });
    }
  }
}

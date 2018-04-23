import ShaderUniformVariable from './ShaderUniformVariable';

const PROJECTION_UNIFORM_NAME = 'projection';

export default class ProjectionUniform extends ShaderUniformVariable {
  constructor(projection, name = PROJECTION_UNIFORM_NAME) {
    super(name, projection.mat4, { projection });
  }

  get projection() {
    return this.hint('projection');
  }

  update(width, height) {
    if (this.projection.update(width, height)) {
      this.touch();
    }
  }
}

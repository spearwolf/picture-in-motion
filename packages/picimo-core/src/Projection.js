import Mat4 from './Mat4';
import ShaderUniformVariable from './ShaderUniformVariable';

const UNIFORM_NAME = 'viewMatrix';

/**
 * @param {object} options
 * @param {number} [options.desiredWidth] - desired width
 * @param {number} [options.desiredHeight] - desired height
 * @param {number} [options.pixelRatio] - pixel ratio
 * @param {number} [options.perspective=0] - perspective distance (0 means no perspective)
 * @param {string} [options.sizeFit] - `cover`, `contain` or `fill`
 * @param {string} [options.uniformName='viewMatrix'] - name of the uniform value
 */
export default class Projection {
  constructor({
    desiredWidth,
    desiredHeight,
    pixelRatio,
    sizeFit,
    uniformName,
    perspective,
  }) {
    this.desiredWidth = desiredWidth;
    this.desiredHeight = desiredHeight;
    this.pixelRatio = pixelRatio;
    this.sizeFit = sizeFit;
    this.uniformName = uniformName;
    this.perspective = perspective;
    this.lastPerspective = undefined;
    this.width = 0;
    this.height = 0;
  }

  createUniform() {
    return new ShaderUniformVariable(this.uniformName, new Mat4(), this);
  }

  set uniformName(uniformName) {
    const name = uniformName || UNIFORM_NAME;
    // TODO lazy create
    if (!this.uniform || this.uniform.name !== name) {
      this.uniform = new ShaderUniformVariable(name, new Mat4(), this);
    }
  }

  get uniformName() {
    return (this.uniform && this.uniform.name) || UNIFORM_NAME;
  }

  get mat4() {
    return this.uniform.data;
  }

  get serial() {
    return this.uniform.serial;
  }

  set perspective(distance) {
    this._perspective = typeof distance === 'number' ? Math.abs(distance) : 0;
  }

  get perspective() {
    return this._perspective;
  }

  updateOrtho(width, height) {
    const { perspective } = this;
    if (width !== this.width || height !== this.height || perspective !== this.lastPerspective) {
      this.width = width;
      this.height = height;
      this.lastPerspective = perspective;
      if (perspective > 0) {
        this.uniform.data.perspective(width, height, perspective);
      } else {
        this.uniform.data.ortho(width, height);
      }
      this.uniform.touch();
    }
  }

  update(currentWidth, currentHeight) {
    if (this.sizeFit === 'fill' && this.desiredWidth > 0 && this.desiredHeight > 0) {
      this.updateOrtho(this.desiredWidth, this.desiredHeight);
    } else if ((this.sizeFit === 'cover' || this.sizeFit === 'contain') &&
      this.desiredWidth >= 0 && this.desiredHeight >= 0) {
      const currentRatio = currentHeight / currentWidth; // <1 : landscape, >1 : portrait
      const desiredRatio = this.desiredHeight / this.desiredWidth;
      const isCover = this.sizeFit === 'cover';

      let width = this.desiredWidth;
      let height = this.desiredHeight;

      if ((this.desiredWidth === 0 && this.desiredHeight) || currentRatio < desiredRatio) {
        width = (this.desiredHeight / currentHeight) * currentWidth;
        if (isCover) {
          const factor = this.desiredWidth / width;
          width *= factor;
          height *= factor;
        }
      } else if ((this.desiredWidth && this.desiredHeight === 0) || currentRatio > desiredRatio) {
        height = (this.desiredWidth / currentWidth) * currentHeight;
        if (isCover) {
          const factor = this.desiredHeight / height;
          width *= factor;
          height *= factor;
        }
      }
      // TODO pixelRatio and currentPixelRatio
      this.updateOrtho(width, height);
    }
  }
}

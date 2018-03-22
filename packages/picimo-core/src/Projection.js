import Mat4 from './Mat4';

export const COVER = 'cover';
export const CONTAIN = 'contain';
export const FILL = 'fill';

/**
 * @param {object} options
 * @param {number} [options.desiredWidth=0] - desired width
 * @param {number} [options.desiredHeight=0] - desired height
 * @param {number} [options.pixelRatio] - TODO pixel ratio
 * @param {number} [options.perspective=0] - perspective distance (0 means no perspective)
 * @param {string} [options.sizeFit] - `cover`, `contain` or `fill`
 */
export default class Projection {
  constructor({
    desiredWidth,
    desiredHeight,
    pixelRatio,
    sizeFit,
    perspective,
  }) {
    this.desiredWidth = desiredWidth || 0;
    this.desiredHeight = desiredHeight || 0;
    this.pixelRatio = pixelRatio;
    this.sizeFit = sizeFit;
    this.perspective = perspective;
    this.lastPerspective = undefined;
    this.width = 0;
    this.height = 0;
    this.mat4 = new Mat4();
  }

  set perspective(distance) {
    this._perspective = typeof distance === 'number' ? Math.abs(distance) : 0;
  }

  get perspective() {
    return this._perspective;
  }

  /**
   * @return {bool} returns `true` if projection `mat4` updated, returns `false` if unchanged
   */
  updateOrtho(width, height) {
    const { perspective } = this;
    if (width !== this.width || height !== this.height || perspective !== this.lastPerspective) {
      this.width = width;
      this.height = height;
      this.lastPerspective = perspective;
      if (perspective > 0) {
        this.mat4.perspective(width, height, perspective);
      } else {
        this.mat4.ortho(width, height);
      }
      return true;
    }
    return false;
  }

  /**
   * @return {bool} returns `true` if projection `mat4` updated, returns `false` if unchanged
   */
  update(currentWidth, currentHeight) {
    if (this.sizeFit === FILL && this.desiredWidth > 0 && this.desiredHeight > 0) {
      return this.updateOrtho(this.desiredWidth, this.desiredHeight);
    } else if ((this.sizeFit === COVER || this.sizeFit === CONTAIN) &&
      this.desiredWidth >= 0 && this.desiredHeight >= 0) {
      const currentRatio = currentHeight / currentWidth; // <1 : landscape, >1 : portrait
      const desiredRatio = this.desiredHeight / this.desiredWidth;
      const isCover = this.sizeFit === COVER;

      let width = this.desiredWidth;
      let height = this.desiredHeight;

      if ((this.desiredWidth === 0 && this.desiredHeight) || currentRatio < desiredRatio || (currentRatio === 1 && desiredRatio > 1)) {
        width = (this.desiredHeight / currentHeight) * currentWidth;
        if (isCover) {
          const factor = this.desiredWidth / width;
          width *= factor;
          height *= factor;
        }
      } else if ((this.desiredWidth && this.desiredHeight === 0) || currentRatio > desiredRatio || (currentRatio === 1 && desiredRatio < 1)) {
        height = (this.desiredWidth / currentWidth) * currentHeight;
        if (isCover) {
          const factor = this.desiredHeight / height;
          width *= factor;
          height *= factor;
        }
      }
      return this.updateOrtho(width, height);
    }
    // TODO pixelRatio and currentPixelRatio
    return false;
  }
}

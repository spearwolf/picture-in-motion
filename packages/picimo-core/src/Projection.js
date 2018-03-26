/* eslint-env browser */
import Mat4 from './Mat4';

export const COVER = 'cover';
export const CONTAIN = 'contain';
export const FILL = 'fill';

/**
 * @param {object} options
 * @param {number} [options.pixelRatio] - generate width & height by a pixel ratio
 * @param {number} [options.devicePixelRatio] - force set `devicePixelRatio` to a fixed value (default is read out from `window.devicePixelRatio`)
 * @param {number} [options.width=0] - desired width
 * @param {number} [options.height=0] - desired height
 * @param {number} [options.perspective=0] - perspective distance (0 means no perspective)
 * @param {string} [options.fit] - `cover`, `contain` or `fill`
 */
export default class Projection {
  constructor({
    devicePixelRatio,
    fit,
    height,
    perspective,
    pixelRatio,
    width,
  }) {
    this.desiredWidth = width || 0;
    this.desiredHeight = height || 0;
    this.desiredPixelRatio = pixelRatio;
    this.customDevicePixelRatio = devicePixelRatio;
    this.fit = fit;
    this.perspective = perspective;
    this.lastPerspective = undefined;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 0;
    this.rawWidth = 0;
    this.rawHeight = 0;
    this.mat4 = new Mat4();
  }

  get devicePixelRatio() {
    return this.customDevicePixelRatio || window.devicePixelRatio || 1;
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
      this.pixelRatio = this.rawHeight / height;
      return true;
    }
    return false;
  }

  /**
   * @return {bool} returns `true` if projection `mat4` updated, returns `false` if unchanged
   */
  update(currentWidth, currentHeight) {
    this.rawWidth = currentWidth;
    this.rawHeight = currentHeight;
    const { desiredPixelRatio } = this;
    if (typeof desiredPixelRatio === 'number' && desiredPixelRatio > 0) {
      // pixelRatio
      // ----------
      const r = this.devicePixelRatio * desiredPixelRatio;
      const width = currentWidth / r;
      const height = currentHeight / r;
      return this.updateOrtho(width, height);
    } else if (this.fit === FILL && this.desiredWidth > 0 && this.desiredHeight > 0) {
      // FILL
      // ----
      return this.updateOrtho(this.desiredWidth, this.desiredHeight);
    } else if ((this.fit === COVER || this.fit === CONTAIN) &&
      // COVER|CONTAIN
      // -------------
      this.desiredWidth >= 0 && this.desiredHeight >= 0) {
      const currentRatio = currentHeight / currentWidth; // <1 : landscape, >1 : portrait
      const desiredRatio = this.desiredHeight / this.desiredWidth;
      const isCover = this.fit === COVER;

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
    return false;
  }
}

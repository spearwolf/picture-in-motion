/**
 * Represents a 2d axis aligned boundary box.
 *
 * @class AABB2
 * @param {number} [x0=0] - x0
 * @param {number} [x1=0] - x1
 * @param {number} [y0=0] - y0
 * @param {number} [y1=0] - y1
 */

export default class AABB2 {
  constructor(x0 = 0, x1 = 0, y0 = 0, y1 = 0) {
    if (x0 < x1) {
      this.minX = x0;
      this.maxX = x1;
    } else {
      this.minX = x1;
      this.maxX = x0;
    }

    if (y0 < y1) {
      this.minY = y0;
      this.maxY = y1;
    } else {
      this.minY = y1;
      this.maxY = y0;
    }
  }

  get width() {
    return this.maxX - this.minX;
  }

  get height() {
    return this.maxY - this.minY;
  }

  /**
   * @param {number} y
   */
  set width(w) {
    this.maxX = this.minX + w;
  }

  /**
   * @param {number} y
   */
  set height(h) {
    this.maxY = this.minY + h;
  }

  get centerX() {
    return this.minX + ((this.maxX - this.minX) / 2);
  }

  /**
   * @type {number}
   */
  get centerY() {
    return this.minY + ((this.maxY - this.minY) / 2);
  }

  /**
   * Extend the boundary box.
   *
   * @param {number} x - x
   * @param {number} y - y
   */
  addPoint(x, y) {
    if (x < this.minX) {
      this.minX = x;
    } else if (x > this.maxX) {
      this.maxX = x;
    }

    if (y < this.minY) {
      this.minY = y;
    } else if (y > this.maxY) {
      this.maxY = y;
    }
  }

  /**
   * Determinates wether or the 2d point is inside this AABB.
   *
   * @param {number} x - x
   * @param {number} y - y
   * @return {boolean} return true when point is inside the aabb
   */
  isInside(x, y) {
    return x >= this.minX && x < this.maxX && y >= this.minY && y < this.maxY;
  }

  /**
   * Determinates wether or not this AABB intersects *aabb*.
   *
   * @param {AABB2} aabb - aabb
   * @return {boolean} return true when there is some intersection between both
   */
  isIntersection(aabb) {
    return !(
      aabb.maxX <= this.minX ||
      aabb.minX >= this.maxX ||
      aabb.maxY <= this.minY ||
      aabb.minY >= this.maxY
    );
  }
}

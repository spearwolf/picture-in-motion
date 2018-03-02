import AABB2 from './AABB2';

export default class Viewport extends AABB2 {
  /**
   * @param {number} x - x
   * @param {number} y - y
   * @param {number} width - width
   * @param {number} height - height
   */
  constructor(x, y, width, height) {
    super(x, (x + width), y, (y + height));
  }

  get x() {
    return this.minX;
  }

  /**
   * @param {number} x
   */
  set x(x) {
    const w = this.width;

    this.minX = x;
    this.maxX = x + w;
  }

  get y() {
    return this.minY;
  }

  /**
   * @param {number} y
   */
  set y(y) {
    const h = this.height;

    this.minY = y;
    this.maxY = y + h;
  }
}

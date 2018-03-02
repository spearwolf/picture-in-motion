import createCanvas from './createCanvas';
import createGl from './createGl';

export default class WebGlRenderer {
  /**
   * @param {HTMLElement} domElement - The `<canvas>` element or the *container* element.
   */
  constructor(domElement, options) {
    this.domElement = domElement;
    this.canvas = createCanvas(domElement);
    this.gl = createGl(this.canvas, options);
  }
}

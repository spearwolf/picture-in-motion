import createCanvas from './createCanvas';

export default class WebGlRenderer {
  /**
   * @param {HTMLElement} domElement - The `<canvas>` element or the *container* element.
   */
  constructor(domElement) {
    this.domElement = domElement;
    this.canvas = createCanvas(domElement);
  }
}

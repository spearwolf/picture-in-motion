/* eslint-env browser */
import generateUuid from './generateUuid';

export default class ShaderSource {
  /**
   * @param {string} type - `VERTEX_SHADER` or `FRAGMENT_SHADER`
   * @param {HTMLElement|string} source
   */
  constructor(type, source) {
    /**
     * @type {string}
     */
    this.id = generateUuid();

    this.type = type;

    /**
     * @type {string}
     */
    this.source = source instanceof HTMLElement ? source.textContent : source;
  }
}

ShaderSource.VERTEX_SHADER = 'VERTEX_SHADER';
ShaderSource.FRAGMENT_SHADER = 'FRAGMENT_SHADER';

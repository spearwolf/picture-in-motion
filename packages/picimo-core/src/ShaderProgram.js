import generateUuid from './generateUuid';

export default class ShaderProgram {
  /**
   * @param {ShaderSource} vertexShader
   * @param {ShaderSource} fragmentShader
   * @param {string} [id] id
   */
  constructor(vertexShader, fragmentShader, id) {
    /**
     * @type {string}
     */
    this.id = id || generateUuid();

    /**
     * @type {ShaderSource}
     */
    this.vertexShader = vertexShader;

    /**
     * @type {ShaderSource}
     */
    this.fragmentShader = fragmentShader;
  }
}

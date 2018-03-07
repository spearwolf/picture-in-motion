import generateUuid from './generateUuid';

export default class ShaderProgram {
  /**
   * @param {ShaderSource} vertexShader
   * @param {ShaderSource} fragmentShader
   */
  constructor(vertexShader, fragmentShader) {
    /**
     * @type {string}
     */
    this.id = generateUuid();

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

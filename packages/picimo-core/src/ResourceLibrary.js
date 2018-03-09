import VODescriptor from './VODescriptor';
import ShaderSource from './ShaderSource';

export default class ResourceLibrary {
  constructor() {
    this.descriptors = new Map();
    this.vertexShaders = new Map();
    this.fragmentShaders = new Map();
  }

  /**
   * @param {string} id
   * @param {Object|VODescriptor} descriptor - See `VODescriptor` constructor for more details
   * @returns {VODescriptor}
   */
  createDescriptor(id, descriptor) {
    const voDescriptor = descriptor instanceof VODescriptor ? descriptor : new VODescriptor(descriptor);
    this.descriptors.set(id, voDescriptor);
    return voDescriptor;
  }

  /**
   * @param {string} id
   * @param {ShaderSource} vertexShader - the *vertex shader*
   * @returns {ShaderSource} - the *vertex shader*
   */
  addVertexShader(id, vertexShader) {
    if (vertexShader.type !== ShaderSource.VERTEX_SHADER) {
      throw new Error(`addVertexShader: shaderSource has wrong type=${vertexShader.type} (expected type=${ShaderSource.VERTEX_SHADER})`);
    }
    this.vertexShaders.set(id, vertexShader);
    return vertexShader;
  }

  /**
   * @param {string} id
   * @param {ShaderSource} vertexShader - *vertex shader*
   * @returns {ShaderSource} - the *fragment shader*
   */
  addFragmentShader(id, fragmentShader) {
    if (fragmentShader.type !== ShaderSource.FRAGMENT_SHADER) {
      throw new Error(`addFragmentShader: shaderSource has wrong type=${fragmentShader.type} (expected type=${ShaderSource.FRAGMENT_SHADER})`);
    }
    this.fragmentShaders.set(id, fragmentShader);
    return fragmentShader;
  }

  /**
   * @param {string} id
   * @param {string|function|string[]} source - See `ShaderSource` constructor for more details
   * @returns {ShaderSource} - the *vertex shader*
   */
  createVertexShader(source) {
    const vertexShader = new ShaderSource(ShaderSource.VERTEX_SHADER, source);
    this.vertexShaders.set(vertexShader.id, vertexShader);
    return vertexShader;
  }

  /**
   * @param {string} id
   * @param {string|function|string[]} source - See `ShaderSource` constructor for more details
   * @returns {ShaderSource} - the *fragment shader*
   */
  createFragmentShader(source) {
    const fragmentShader = new ShaderSource(ShaderSource.FRAGMENT_SHADER, source);
    this.fragmentShaders.set(fragmentShader.id, fragmentShader);
    return fragmentShader;
  }

  /**
   * @param {string} id
   * @returns {VODescriptor}
   */
  findDescriptor(id) {
    return this.descriptors.get(id);
  }

  /**
   * @param {string} id
   * @returns {ShaderSource} - the *vertex shader*
   */
  findVertexShader(id) {
    return this.vertexShaders.get(id);
  }

  /**
   * @param {string} id
   * @returns {ShaderSource} - the *fragment shader*
   */
  findFragmentShader(id) {
    return this.fragmentShaders.get(id);
  }
}

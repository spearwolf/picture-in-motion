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
   * @returns {string} id
   */
  createDescriptor(id, descriptor) {
    const voDescriptor = descriptor instanceof VODescriptor ? descriptor : new VODescriptor(descriptor);
    this.descriptors.set(id, voDescriptor);
    return id;
  }

  /**
   * @param {string} id
   * @param {ShaderSource} vertexShader - the *vertex shader*
   * @returns {string} id
   */
  addVertexShader(id, vertexShader) {
    if (vertexShader.type !== ShaderSource.VERTEX_SHADER) {
      throw new Error(`addVertexShader: shaderSource has wrong type=${vertexShader.type} (expected type=${ShaderSource.VERTEX_SHADER})`);
    }
    this.vertexShaders.set(id, vertexShader);
    return id;
  }

  /**
   * @param {string} id
   * @param {ShaderSource} fragmentShader - *vertex shader*
   * @returns {string} id
   */
  addFragmentShader(id, fragmentShader) {
    if (fragmentShader.type !== ShaderSource.FRAGMENT_SHADER) {
      throw new Error(`addFragmentShader: shaderSource has wrong type=${fragmentShader.type} (expected type=${ShaderSource.FRAGMENT_SHADER})`);
    }
    this.fragmentShaders.set(id, fragmentShader);
    return id;
  }

  /**
   * @param {string|function|string[]} source - See `ShaderSource` constructor for more details
   * @returns {string} id
   */
  createVertexShader(source) {
    const vertexShader = new ShaderSource(ShaderSource.VERTEX_SHADER, source);
    this.vertexShaders.set(vertexShader.id, vertexShader);
    return vertexShader.id;
  }

  /**
   * @param {string|function|string[]} source - See `ShaderSource` constructor for more details
   * @returns {string} id
   */
  createFragmentShader(source) {
    const fragmentShader = new ShaderSource(ShaderSource.FRAGMENT_SHADER, source);
    this.fragmentShaders.set(fragmentShader.id, fragmentShader);
    return fragmentShader.id;
  }

  /**
   * @param {string} id
   * @returns {VODescriptor}
   */
  getDescriptor(id) {
    return this.descriptors.get(id);
  }

  /**
   * @param {string} id
   * @returns {ShaderSource} - the *vertex shader*
   */
  getVertexShader(id) {
    return this.vertexShaders.get(id);
  }

  /**
   * @param {string} id
   * @returns {ShaderSource} - the *fragment shader*
   */
  getFragmentShader(id) {
    return this.fragmentShaders.get(id);
  }
}

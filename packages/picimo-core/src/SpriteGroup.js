import ElementIndexArray from './ElementIndexArray';
import ShaderProgram from './ShaderProgram';
import ShaderTextureGroup from './ShaderTextureGroup';
import ShaderVariableBufferGroup from './ShaderVariableBufferGroup';
import VOPool from './VOPool';
import pick from './pick';

/** @private */
const pickVOPoolOpts = pick([
  'capacity',
  'usage',
  'maxAllocVOSize',
  'voArray',
  'doubleBuffer',
]);

/**
 * @param {VODescriptor} descriptor - The `VODescriptor` (*vertex object description*)
 * @param {TextureLibrary} textureLibrary - The *texture library* which the textures contains
 * @param {Object} options - Options
 * @param {number} [options.capacity] - Maximum number of *sprites*
 * @param {VOArray} [options.voArray] - The internal *vertex object array*
 * @param {Object|function} [options.voZero] - *vertex object* prototype
 * @param {Object|function} [options.voNew] - *vertex object* prototype
 * @param {number} [options.maxAllocVOSize] - Never allocate more than `maxAllocVOSize` *sprites* at once
 * @param {string} [options.usage='dynamic'] - Buffer usage hint, choose between `dynamic` or `static`
 * @param {string} [options.indices] - The `ElementIndexArray` which holds the *vertex index* buffer
 * @param {string} [options.primitive] - The primtive type hint for the renderer
 * @param {ShaderProgram} [options.shader] - The `ShaderProgram`. As alternative you can use the `vertexShader` option together with `fragmentShader`
 * @param {string|ShaderSource} [options.vertexShader] - The *vertex shader*
 * @param {string|ShaderSource} [options.fragmentShader] - The *fragment shader*
 * @param {Object} [options.textures] - The *shader variable name* to *texture* mapping
 * @param {string} [options.doubleBuffer] - buffer `doubleBuffer` hint, set to `true` (which is the default if `usage` equals to `dynamic`) or `false`.
 */
export default class SpriteGroup {
  constructor(descriptor, textureLibrary, options = {}) {
    this.descriptor = descriptor;
    this.textureLibrary = textureLibrary;

    let {
      voNew,
      voZero,
    } = options;
    if (voNew) {
      voNew = descriptor.createVO(null, voNew);
    }
    if (voZero) {
      voZero = descriptor.createVO(null, voZero);
    }

    this.voPool = new VOPool(descriptor, Object.assign({
      maxAllocVOSize: 1000,
    }, pickVOPoolOpts(options), {
      voNew,
      voZero,
    }));

    this.voPoolShaderAttribs = new ShaderVariableBufferGroup(this.voPool);

    this.indices = options.indices || ElementIndexArray.Generate(
      this.voPool.capacity,
      [0, 1, 2, 0, 2, 3], 4, // quads
      // TODO create ElementIndexArray factories! capacity=N, type=quads, ...
    );

    this.shaderProgram = options.shaderProgram;

    if (!this.shaderProgram && options.vertexShader && options.fragmentShader) {
      this.shaderProgram = new ShaderProgram(options.vertexShader, options.fragmentShader);
    }

    this.primitive = options.primitive;

    this.textures = Object.assign({}, options.textures);
    this.shaderTextureGroup = null;
  }

  get capacity() {
    return this.voPool.capacity;
  }

  get usedCount() {
    return this.voPool.usedCount;
  }

  get availableCount() {
    return this.voPool.availableCount;
  }

  setTexture(sampler, textureId) {
    if (this.textures[sampler] !== textureId) {
      this.textures[sampler] = textureId;
      this.shaderTextureGroup = null;
    }
  }

  loadTextureAtlas(sampler, url, textureAtlasOptions) {
    this.textures[sampler] = url;
    this.shaderTextureGroup = null;
    return this.textureLibrary.loadTextureAtlas(url, url, textureAtlasOptions);
  }

  getTextureAtlas(sampler) {
    return this.textureLibrary.getTextureAtlas(this.textures[sampler]);
  }

  createSprite(texture, width, height) {
    const vo = this.voPool.alloc(1);
    if (!texture) return vo;

    const w = width || texture.width;
    const h = height || texture.height;
    vo.setSize(w, h);
    vo.setTexCoordsByTexture(texture);
    return vo;
  }

  renderFrame(renderer) {
    if (!this.shaderTextureGroup) {
      this.shaderTextureGroup = new ShaderTextureGroup(this.textureLibrary, this.textures);
    }

    this.shaderTextureGroup.whenLoaded((texUniforms) => {
      const { shaderContext } = renderer;

      shaderContext.pushVar(texUniforms);
      shaderContext.pushVar(this.voPoolShaderAttribs);

      renderer.useShaderProgram(this.shaderProgram);

      renderer.drawIndexed(this.primitive, this.indices);
    });
  }

  /**
   * inform the internally used vertex buffers that content has changed
   * and should be uploaded to gpu before next usage.
   * you don't need to call this if you choosed `dynamic` as *usage* option.
   */
  touchVertexBuffers() {
    this.voPool.voArray.ref.touch();
  }
}

import ShaderProgram from './ShaderProgram';
import ShaderVariableBufferGroup from './ShaderVariableBufferGroup';
import VOPool from './VOPool';
import pick from './pick';

/** @private */
const pickVOPoolOpts = pick([
  'autotouch',
  'capacity',
  'doubleBuffer',
  'maxAllocVOSize',
  'usage',
  'voArray',
]);

/** @private */
const createSpriteSizeHook = (setSize = 'size') => {
  switch (typeof setSize) {
    case 'string':
      return (sprite, w, h, descriptor) => descriptor.attr[setSize].setValue(sprite, [w, h]);
    case 'function':
      return setSize;

    case 'object':
    case 'boolean':
      if (!setSize) {
        return null;
      }
    default: // eslint-disable-line
      throw new Error(`SpriteGroup: invalid sprite size setter! (is ${typeof setSize} but should be a function, string, null or false)`);
  }
};

/**
 * @param {VODescriptor} descriptor - The `VODescriptor` (*vertex object description*)
 * @param {Object} options - Options
 * @param {number} [options.capacity] - Maximum number of *sprites*
 * @param {IndexedPrimitive|ElementIndexArray|function} primitive - The *primitive factory function* is a function that takes one argument (capacity) and returns an IndexedPrimitive instance
 * @param {VOArray} [options.voArray] - The internal *vertex object array*
 * @param {Object|function} [options.voZero] - *vertex object* prototype
 * @param {Object|function} [options.voNew] - *vertex object* prototype
 * @param {function|string} [options.setSize='size'] - A function that takes three arguments (sprite, width, height) and sets the size of sprite (called by `.createSprite(w, h)`). Or you can specify the *name* of the size attribute (should be a 2d vector unform).
 * @param {number} [options.maxAllocVOSize] - Never allocate more than `maxAllocVOSize` *sprites* at once
 * @param {string} [options.usage='dynamic'] - Buffer usage hint, choose between `dynamic` or `static`
 * @param {ShaderProgram} [options.shaderProgram] - The `ShaderProgram`. As alternative you can use the `vertexShader` option together with `fragmentShader`
 * @param {string|ShaderSource} [options.vertexShader] - The *vertex shader*
 * @param {string|ShaderSource} [options.fragmentShader] - The *fragment shader*
 * @param {Object} [options.textures] - The *shader variable name* to *texture* mapping
 * @param {boolean} [options.doubleBuffer] - buffer `doubleBuffer` hint, set to `true` (which is the default if `usage` equals to `dynamic`) or `false`
 * @param {boolean} [options.autotouch] - auto touch vertex buffers hint, set to `true` (which is the default if `usage` equals to `dynamic`) or `false`.
 * @param {SpriteGroup} [options.base] - The instance base sprite group
 */
export default class SpriteGroup {
  constructor(descriptor, options = {}) {
    this.descriptor = descriptor;
    this.base = options.base;

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

    this.spriteHook = {
      setSize: createSpriteSizeHook(options.setSize),
    };

    this.voPool = new VOPool(descriptor, Object.assign({
      maxAllocVOSize: 1000,
    }, pickVOPoolOpts(options), {
      voNew,
      voZero,
    }));

    this.voPoolShaderAttribs = new ShaderVariableBufferGroup(this.voPool);

    const { primitive } = options;
    if (typeof primitive === 'function') {
      this.primitive = primitive(this.capacity);
    } else {
      this.primitive = primitive;
    }

    this.shaderProgram = options.shaderProgram;
    if (!this.shaderProgram && options.vertexShader && options.fragmentShader) {
      this.shaderProgram = new ShaderProgram(options.vertexShader, options.fragmentShader);
    }
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

  /**
   * @param {number} [width]
   * @param {number} [height=width]
   */
  createSprite(width, height) {
    const sprite = this.voPool.alloc(1);
    const { setSize } = this.spriteHook;
    if (setSize && width !== undefined) {
      setSize(sprite, width, height !== undefined ? height : width, this.descriptor);
    }
    return sprite;
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

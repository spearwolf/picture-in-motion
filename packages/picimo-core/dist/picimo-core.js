'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var glMatrix = require('gl-matrix');
var utils = require('@picimo/utils');

const isNumber = x => typeof x === 'number';

const add = (a, b) => {
  if (isNumber(a) && isNumber(b)) {
    return a + b;
  } else if (isNumber(a)) {
    switch (a) {
      case 0:
        return b;
      default:
        return `${a} + ${b}`;
    }
  } else if (isNumber(b)) {
    switch (b) {
      case 0:
        return a;
      default:
        return `${a} + ${b}`;
    }
  } else {
    return `${a} + ${b}`;
  }
};

const sub = (a, b) => {
  if (isNumber(a) && isNumber(b)) {
    return a - b;
  } else if (isNumber(a)) {
    switch (a) {
      case 0:
        return `-${b}`;
      default:
        return `${a} - ${b}`;
    }
  } else if (isNumber(b)) {
    switch (b) {
      case 0:
        return a;
      default:
        return `${a} - ${b}`;
    }
  } else {
    return `${a} - ${b}`;
  }
};

const mul = (a, b) => {
  if (isNumber(b) && isNumber(a)) {
    return a * b;
  } else if (isNumber(a)) {
    switch (a) {
      case 0:
        return 0;
      case 1:
        return b;
      default:
        return `${a} * ${b}`;
    }
  } else if (isNumber(b)) {
    switch (b) {
      case 0:
        return 0;
      case 1:
        return a;
      default:
        return `${a} * ${b}`;
    }
  } else {
    return `${a} * ${b}`;
  }
};

const asFloat = (number) => {
  const str = `${number}`.trim();
  if (str.match(/^[0-9]+$/)) {
    return `${str}.0`;
  }
  return str;
};

const ret = res => `return ${res};`;

const mat4 = (m00 = 0, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 0, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 0, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1, as = asFloat) => {
  const toStr = as || (x => `${x}`);
  return `mat4(${toStr(m00)}, ${toStr(m01)}, ${toStr(m02)}, ${toStr(m03)}, ${toStr(m10)}, ${toStr(m11)}, ${toStr(m12)}, ${toStr(m13)}, ${toStr(m20)}, ${toStr(m21)}, ${toStr(m22)}, ${toStr(m23)}, ${toStr(m30)}, ${toStr(m31)}, ${toStr(m32)}, ${toStr(m33)})`;
};

const rotate = (funcName = 'rotate', x = 0.0, y = 0.0, z = 1.0) => `
mat4 ${funcName}(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  ${ret(mat4(
    add(mul('oc', x * x), 'c'), sub(mul('oc', x * y), mul(z, 's')), add(mul('oc', z * x), mul(y, 's')), 0,
    add(mul('oc', x * y), mul(z, 's')), add(mul('oc', y * y), 'c'), sub(mul('oc', y * z), mul(x, 's')), 0,
    sub(mul('oc', z * x), mul(y, 's')), add(mul('oc', y * z), mul(x, 's')), add(mul('oc', z * z), 'c'),
  ))}
}`;

const rotateZ = (funcName = 'rotateZ') => rotate(funcName, 0, 0, 1);

var ShaderTool = /*#__PURE__*/Object.freeze({
  add: add,
  sub: sub,
  mul: mul,
  asFloat: asFloat,
  ret: ret,
  mat4: mat4,
  rotate: rotate,
  rotateZ: rotateZ
});

/**
 * Represents a 2d axis aligned boundary box.
 *
 * @class AABB2
 * @param {number} [x0=0] - x0
 * @param {number} [x1=0] - x1
 * @param {number} [y0=0] - y0
 * @param {number} [y1=0] - y1
 */

class AABB2 {
  constructor(x0 = 0, x1 = 0, y0 = 0, y1 = 0) {
    if (x0 < x1) {
      this.minX = x0;
      this.maxX = x1;
    } else {
      this.minX = x1;
      this.maxX = x0;
    }

    if (y0 < y1) {
      this.minY = y0;
      this.maxY = y1;
    } else {
      this.minY = y1;
      this.maxY = y0;
    }
  }

  get width() {
    return this.maxX - this.minX;
  }

  get height() {
    return this.maxY - this.minY;
  }

  /**
   * @param {number} y
   */
  set width(w) {
    this.maxX = this.minX + w;
  }

  /**
   * @param {number} y
   */
  set height(h) {
    this.maxY = this.minY + h;
  }

  get centerX() {
    return this.minX + ((this.maxX - this.minX) / 2);
  }

  /**
   * @type {number}
   */
  get centerY() {
    return this.minY + ((this.maxY - this.minY) / 2);
  }

  /**
   * Extend the boundary box.
   *
   * @param {number} x - x
   * @param {number} y - y
   */
  addPoint(x, y) {
    if (x < this.minX) {
      this.minX = x;
    } else if (x > this.maxX) {
      this.maxX = x;
    }

    if (y < this.minY) {
      this.minY = y;
    } else if (y > this.maxY) {
      this.maxY = y;
    }
  }

  /**
   * Determinates wether or the 2d point is inside this AABB.
   *
   * @param {number} x - x
   * @param {number} y - y
   * @return {boolean} return true when point is inside the aabb
   */
  isInside(x, y) {
    return x >= this.minX && x < this.maxX && y >= this.minY && y < this.maxY;
  }

  /**
   * Determinates wether or not this AABB intersects *aabb*.
   *
   * @param {AABB2} aabb - aabb
   * @return {boolean} return true when there is some intersection between both
   */
  isIntersection(aabb) {
    return !(
      aabb.maxX <= this.minX ||
      aabb.minX >= this.maxX ||
      aabb.maxY <= this.minY ||
      aabb.minY >= this.maxY
    );
  }
}

/** @private */

// https://gist.github.com/jed/982883
const uuid = ()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16)); // eslint-disable-line

/**
 * @desc
 * Generic data reference with a *type* and *serial number*.
 *
 * Each time you are setting the `data` property to a new value, the serial number will be increased.
 * Use `.touch()` if you want to increase the serial number without changing the value.
 *
 */
class DataRef {
  constructor(type, data, hints = null) {
    this.type = type;
    this.data_ = data;
    this.id = (hints && hints.id) ? String(hints.id) : uuid();
    this.serial = (hints && typeof hints.serial === 'number') ? hints.serial : 1;
    this.hints = hints;
  }

  get data() {
    return this.data_;
  }

  set data(next) {
    const current = this.data_;

    if (next !== current) {
      this.data_ = next;
      this.touch();
    }
  }

  touch() {
    this.serial++;
  }

  /**
   * @param {DataRef} otherRef
   * @returns {boolean} Returns `true` if *serial* is greater than 0 and equals to *serial* from `otherRef`
   */
  isSynced(otherRef) {
    const { serial } = this;
    return serial > 0 && serial === otherRef.serial;
  }

  /**
   * @param {DataRef} otherRef
   * @returns {boolean} - Returns the opposite of `isSynced()`
   */
  needSync(otherRef) {
    return !this.isSynced(otherRef);
  }

  /**
   * @param {DataRef} otherRef
   * @param {function} callback
   */
  sync(otherRef, callback) {
    if (this.needSync(otherRef)) {
      callback(this.data);
      this.serial = otherRef.serial;
    }
  }

  /**
   * Returns `true` if a hint exists and the hint value is as expected.
   * If you leave out the expected value (call the method with just one argument)
   * the methods just ckecks if the hint exists (regardless ofthe value).
   *
   * @param {string} hintKey
   * @param {*} expectedValue
   * @returns {boolean}
   */
  hasHint(hintKey, expectedValue) {
    if (arguments.length === 1) {
      return Boolean(this.hints && hintKey in this.hints);
    }
    return Boolean(this.hints && hintKey in this.hints && this.hints[hintKey] === expectedValue);
  }

  /**
   * Returns a hint value.
   *
   * @param {string} hintKey
   * @returns {*}
   */
  hint(hintKey) {
    return this.hints && this.hints[hintKey];
  }
}

class ElementIndexArray {
  constructor(objectCount, itemCount, usage = 'static') {
    this.objectCount = objectCount;
    this.itemCount = itemCount;
    this.length = objectCount * itemCount;
    this.array = new Uint16Array(this.length);
    this.ref = new DataRef('ElementIndexArray', this, {
      usage,
      target: 'ELEMENT_ARRAY_BUFFER',
      typedArray: this.array,
    });
  }

  /**
   * @param {number} objectCount
   * @param {number[]} indices
   * @param {number} stride
   * @param {number} [objectOffset=0]
   * @param {string} [usage='static']
   * @return {ElementIndexArray}
   * @example
   * // Create a ElementIndexArray for 10 quads where each quad made up of 2x triangles (4x vertices and 6x indices)
   * const quadIndices = ElementIndexArray.Generate(10, [0, 1, 2, 0, 2, 3], 4)
   * quadIndices.length        // => 60
   * quadIndices.itemCount     // => 6
   */
  static Generate(objectCount, indices, stride, objectOffset = 0, usage = 'static') {
    const arr = new ElementIndexArray(objectCount, indices.length, usage);

    for (let i = 0; i < objectCount; ++i) {
      for (let j = 0; j < indices.length; ++j) {
        arr.array[(i * arr.itemCount) + j] = indices[j] + ((i + objectOffset) * stride);
      }
    }
    return arr;
  }
}

class IndexedPrimitive {
  constructor(primitiveType, elementIndexArray) {
    this.primitiveType = primitiveType;
    this.elementIndexArray = elementIndexArray;
  }

  static createQuads(capacity) {
    return new IndexedPrimitive(
      'TRIANGLES',
      ElementIndexArray.Generate(capacity, [0, 1, 2, 0, 2, 3], 4),
    );
  }
}

const DEG2RAD = Math.PI / 180.0;

class Mat4 {
  constructor() {
    this.mat4 = glMatrix.mat4.create();
  }

  identity() {
    glMatrix.mat4.identity(this.mat4);
  }

  ortho(width, height, zRange = 2 ** 16) {
    const hw = width >> 1;
    const hh = height >> 1;
    const hz = zRange >> 1;
    glMatrix.mat4.ortho(this.mat4, -hw, hw, -hh, hh, -hz, hz);
  }

  perspective(width, height, distance = 100) {
    // https://webglfundamentals.org/webgl/lessons/webgl-3d-perspective.html
    // https://stackoverflow.com/questions/6653080/in-opengl-how-can-i-determine-the-bounds-of-the-view-at-a-given-depth
    // http://glmatrix.net/docs/module-mat4.html
    const aspect = width / height;
    const near = 0;
    const far = 2000;
    const halfHeight = height / 2.0;
    const fovy = 2 * Math.atan(halfHeight / distance);
    glMatrix.mat4.perspective(this.mat4, fovy, aspect, near, far);
    glMatrix.mat4.translate(this.mat4, this.mat4, [0, 0, -distance]);
  }

  translate(x, y, z = 0) {
    glMatrix.mat4.translate(this.mat4, this.mat4, [x, y, z]);
  }

  scale(x, y, z = 1) {
    glMatrix.mat4.scale(this.mat4, this.mat4, [x, y, z]);
  }

  rotateX(deg) {
    glMatrix.mat4.rotateX(this.mat4, this.mat4, deg * DEG2RAD);
  }

  rotateY(deg) {
    glMatrix.mat4.rotateY(this.mat4, this.mat4, deg * DEG2RAD);
  }

  rotateZ(deg) {
    glMatrix.mat4.rotateZ(this.mat4, this.mat4, deg * DEG2RAD);
  }

  multiply(a, b) {
    glMatrix.mat4.multiply(this.mat4, a.mat4, b.mat4);
  }

  copy(src) {
    glMatrix.mat4.copy(this.mat4, src.mat4);
  }

  clone() {
    const dolly = new Mat4();
    dolly.copy(this);
    return dolly;
  }

  get x() {
    return this.mat4[12];
  }

  set x(val) {
    this.mat4[12] = val;
  }

  get y() {
    return this.mat4[13];
  }

  set y(val) {
    this.mat4[13] = val;
  }

  get z() {
    return this.mat4[14];
  }

  set z(val) {
    this.mat4[14] = val;
  }

  get sx() {
    return this.mat4[0];
  }

  set sx(val) {
    this.mat4[0] = val;
  }

  get sy() {
    return this.mat4[5];
  }

  set sy(val) {
    this.mat4[5] = val;
  }

  get sz() {
    return this.mat4[10];
  }

  set sz(val) {
    this.mat4[10] = val;
  }
}

/* eslint-env browser */

/** @private */
function convertToPowerOf2(image) {
  const w = utils.findNextPowerOf2(image.width);
  const h = utils.findNextPowerOf2(image.height);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(image, 0, 0);

  return canvas;
}

/** @private */
function setPowerOf2ImgEl(p2img, imgEl) {
  p2img.imgEl = utils.isPowerOf2(imgEl.width) && utils.isPowerOf2(imgEl.height) ? imgEl : convertToPowerOf2(imgEl);
  p2img.origWidth = imgEl.width;
  p2img.origHeight = imgEl.height;
}

/**
 * Represents a `<img>` or `<canvas>` element which sizes (width and height) are
 * always power of 2.
 */
class PowerOf2Image {
  /**
   * If image dimension is NOT power of 2 then create a new `<canvas>`
   * (with power of 2 dimension) and copy the original image content onto it.
   * Since fetching imge data from server is a *async* operation the `imgEl` property
   * can be `null` right after object construction and will be set later after
   * image is loaded (and possible converted).
   *
   * @param {string|HTMLImageElement|HTMLCanvasElement} from - url or html *image* element
   */
  constructor(from) {
    let imgEl;
    if (typeof from === 'string') {
      imgEl = new window.Image();
      imgEl.src = from;
    } else {
      imgEl = from;
    }
    if (imgEl.onLoaded === false || (imgEl.width === 0 && imgEl.height === 0)) {
      /**
       * @type {HTMLImageElement|HTMLCanvasElement}
       */
      this.imgEl = null;
      /**
       * @type {Promise<PowerOf2Image>}
       */
      this.onLoaded = new Promise((resolve) => {
        const origOnLoad = imgEl.onload;
        imgEl.onload = () => {
          if (origOnLoad) origOnLoad.call(imgEl);
          setPowerOf2ImgEl(this, imgEl);
          resolve(this);
        };
      });
    } else {
      setPowerOf2ImgEl(this, imgEl);
      /**
       * @type {Promise<PowerOf2Image>}
       */
      this.onLoaded = Promise.resolve(this);
    }
  }

  /**
   * A boolean that is `true` if the image has loaded and possible converted.
   * @type {boolean}
   */
  get isComplete() {
    return this.imgEl != null;
  }

  /**
   * Returns image width or `0` if image loading is not finished.
   * @type {number}
   */
  get width() {
    return (this.imgEl && this.imgEl.width) || 0;
  }

  /**
   * Returns image height or `0` if image loading is not finished.
   * @type {number}
   */
  get height() {
    return (this.imgEl && this.imgEl.height) || 0;
  }
}

/* eslint-env browser */

const COVER = 'cover';
const CONTAIN = 'contain';
const FILL = 'fill';

/**
 * @param {object} options
 * @param {number} [options.pixelRatio] - generate width & height by a pixel ratio
 * @param {number} [options.devicePixelRatio] - force set `devicePixelRatio` to a fixed value (default is read out from `window.devicePixelRatio`)
 * @param {number} [options.width=0] - desired width
 * @param {number} [options.height=0] - desired height
 * @param {number} [options.perspective=0] - perspective distance (0 means no perspective)
 * @param {string} [options.fit] - `cover`, `contain` or `fill`
 */
class Projection {
  constructor({
    devicePixelRatio,
    fit,
    height,
    perspective,
    pixelRatio,
    width,
  }) {
    this.desiredWidth = width || 0;
    this.desiredHeight = height || 0;
    this.desiredPixelRatio = pixelRatio;
    this.customDevicePixelRatio = devicePixelRatio;
    this.fit = fit;
    this.perspective = perspective;
    this.lastPerspective = undefined;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 0;
    this.rawWidth = 0;
    this.rawHeight = 0;
    this.mat4 = new Mat4();
  }

  get devicePixelRatio() {
    return this.customDevicePixelRatio || window.devicePixelRatio || 1;
  }

  set perspective(distance) {
    this._perspective = typeof distance === 'number' ? Math.abs(distance) : 0;
  }

  get perspective() {
    return this._perspective;
  }

  /**
   * @return {bool} returns `true` if projection `mat4` updated, returns `false` if unchanged
   */
  updateOrtho(width, height) {
    const { perspective } = this;
    if (width !== this.width || height !== this.height || perspective !== this.lastPerspective) {
      this.width = width;
      this.height = height;
      this.lastPerspective = perspective;
      if (perspective > 0) {
        this.mat4.perspective(width, height, perspective);
      } else {
        this.mat4.ortho(width, height);
      }
      this.pixelRatio = this.rawHeight / height;
      return true;
    }
    return false;
  }

  /**
   * @return {bool} returns `true` if projection `mat4` updated, returns `false` if unchanged
   */
  update(currentWidth, currentHeight) {
    this.rawWidth = currentWidth;
    this.rawHeight = currentHeight;
    const { desiredPixelRatio } = this;
    if (typeof desiredPixelRatio === 'number' && desiredPixelRatio > 0) {
      // pixelRatio
      // ----------
      const r = this.devicePixelRatio * desiredPixelRatio;
      const width = currentWidth / r;
      const height = currentHeight / r;
      return this.updateOrtho(width, height);
    } else if (this.fit === FILL && this.desiredWidth > 0 && this.desiredHeight > 0) {
      // FILL
      // ----
      return this.updateOrtho(this.desiredWidth, this.desiredHeight);
    } else if ((this.fit === COVER || this.fit === CONTAIN) &&
      // COVER|CONTAIN
      // -------------
      this.desiredWidth >= 0 && this.desiredHeight >= 0) {
      const currentRatio = currentHeight / currentWidth; // <1 : landscape, >1 : portrait
      const desiredRatio = this.desiredHeight / this.desiredWidth;
      const isCover = this.fit === COVER;

      let width = this.desiredWidth;
      let height = this.desiredHeight;

      if ((this.desiredWidth === 0 && this.desiredHeight) || currentRatio < desiredRatio || (currentRatio === 1 && desiredRatio > 1)) {
        width = (this.desiredHeight / currentHeight) * currentWidth;
        if (isCover) {
          const factor = this.desiredWidth / width;
          width *= factor;
          height *= factor;
        }
      } else if ((this.desiredWidth && this.desiredHeight === 0) || currentRatio > desiredRatio || (currentRatio === 1 && desiredRatio < 1)) {
        height = (this.desiredWidth / currentWidth) * currentHeight;
        if (isCover) {
          const factor = this.desiredHeight / height;
          width *= factor;
          height *= factor;
        }
      }
      return this.updateOrtho(width, height);
    }
    return false;
  }
}

/**
 * @desc
 * Generic container for *shader variables*.
 *
 * @private
 *
 * A shader variable can be an *uniform*, *vertex attributes* or *textures* ..
 * A shader variable is a `DataRef` but has an additional `name`.
 */
class ShaderVariable extends DataRef {
  /**
   * @param {string} name
   * @param {string} type
   * @param {number|Object} value
   * @param {Object} [hints]
   */
  constructor(name, type, value, hints) {
    super(type, value, Object.assign({ serial: 0 }, hints));

    this.name = name;
  }
}

ShaderVariable.UNIFORM = 'uniform';
ShaderVariable.ATTRIB = 'attrib';
ShaderVariable.TEXTURE_2D = 'tex2d';

/**
 * Shader uniform variable.
 */
class ShaderUniformVariable extends ShaderVariable {
  /**
   * @param {string} name
   * @param {number|Object} value
   * @param {Object} [hints]
   */
  constructor(name, value, hints) {
    super(name, ShaderVariable.UNIFORM, value, hints);
  }
}

const PROJECTION_UNIFORM_NAME = 'projection';

class ProjectionUniform extends ShaderUniformVariable {
  constructor(projection, name = PROJECTION_UNIFORM_NAME) {
    super(name, projection.mat4, { projection });
  }

  get projection() {
    return this.hint('projection');
  }

  update(width, height) {
    if (this.projection.update(width, height)) {
      this.touch();
    }
  }
}

// === private === {{{

/** @private */
const TYPED_ARRAY = {
  float32: Float32Array,
  int16: Int16Array,
  int32: Int32Array,
  int8: Int8Array,
  uint16: Uint16Array,
  uint32: Uint32Array,
  uint8: Uint8Array,
};

/** @private */
const createBufferView = (capacity, bytesPerVO, data) => {
  const byteLength = capacity * bytesPerVO;

  if (data instanceof ArrayBuffer) {
    if (byteLength > data.byteLength) {
      throw new TypeError(`VOArray: [data] buffer is too small! needs ${byteLength} bytes (capacity=${capacity} bytesPerVO=${bytesPerVO}) but has ${data.byteLength} bytes!`);
    }
    return new DataView(data, 0, byteLength);
  }

  if (ArrayBuffer.isView(data)) {
    const { byteOffset, byteLength: dataByteLength } = data;
    if (byteLength > dataByteLength) {
      throw new TypeError(`VOArray: [data] buffer is too small! needs ${byteLength} bytes (capacity=${capacity} bytesPerVO=${bytesPerVO}) but has ${dataByteLength} (byteOffset=${byteOffset}) bytes!`);
    }
    return new DataView(data.buffer, byteOffset, byteLength);
  }

  throw new TypeError('VOArray: [data] must be instanceof ArrayBuffer, DataView or TypedArray!');
};

/** @private */
const typedArrayProp = type => `${type}Array`;

/** @private */
const createLinkedTypedArrays = (buffer, bufferByteOffset, bufferByteLength, arrayTypes) => {
  const typedArrays = {};

  arrayTypes.forEach((type) => {
    const TypedArray = TYPED_ARRAY[type];
    const arr = new TypedArray(buffer, bufferByteOffset, bufferByteLength / TypedArray.BYTES_PER_ELEMENT);
    typedArrays[typedArrayProp(type)] = arr;
  });

  return typedArrays;
};

// --- }}}

/**
 * A wrapper for an ArrayBuffer which additional holds multiple references to typed arrays.
 */
class VOArray {
  /**
   * Create a VOArray
   *
   * For each *array type* a property is created:
   *
   * _arrayType_:`float32` &rarr; _property_:`float32Array` &rarr; _type_:`Float32Array`
   *
   * Valid _array types_ are: `float32`, `int32`, `int16`, `int8`, `uint32`, `uint16`, `uint8`
   *
   * If `data` is defined, no new buffer is created but a *view* of the buffer passed is generated.
   *
   * @param {number} capacity - Number of `vertex objects`
   * @param {number} bytesPerVO - Size of a single `vertex object` in *bytes*. **Must be divisible by 4**.
   * @param {Array<string>} arrayTypes - List of allowed *typed array types*. Should have at least one type included.
   * @param {ArrayBuffer|DataView|TypedArray} [data] - Create a *view* into the buffer from `data`
   * @param {Object} [hints] - Optional *hints* for the *reference*
   */
  constructor(capacity, bytesPerVO, arrayTypes, data, hints) {
    if (bytesPerVO % 4 !== 0) {
      throw new TypeError(`new VOArray: bytesPerVO must be divisible by 4 (but is not!) bytesPerVO=${bytesPerVO}`);
    }

    this.capacity = capacity;
    this.bytesPerVO = bytesPerVO;
    this.arrayTypes = arrayTypes.slice(0);

    if (data) {
      const buffer = createBufferView(capacity, bytesPerVO, data);

      /** @type {ArrayBuffer} */
      this.buffer = buffer.buffer;
      this.bufferByteOffset = buffer.byteOffset;
      this.bufferByteLength = buffer.byteLength;
    } else {
      /** @type {ArrayBuffer} */
      this.buffer = new ArrayBuffer(capacity * bytesPerVO);
      this.bufferByteOffset = 0;
      this.bufferByteLength = this.buffer.byteLength;
    }

    Object.assign(this, createLinkedTypedArrays(this.buffer, this.bufferByteOffset, this.bufferByteLength, arrayTypes));

    this.ref = new DataRef('VOArray', this, Object.assign({
      typedArray: this.toUint32Array(),
      serial: 1,
    }, hints));
  }

  /**
   * Copy all `vertex objects` from *source* to the internal *buffer* (destination).
   * Both *arrays* should have the same `bytesPerVO` value.
   *
   * @param {VOArray} from - Source *array*.
   * @param {number} [toOffset=0] - `vertex object` destination offset
   */
  copy(from, toOffset = 0) {
    const elementsPerVO = this.bytesPerVO / Uint32Array.BYTES_PER_ELEMENT;

    let offset = 0;

    if (toOffset > 0) {
      offset = toOffset * elementsPerVO;
    }

    this.toUint32Array().set(from.toUint32Array(), offset);
  }

  /**
   * Returns the array buffer converted to `Uint32Array`.
   * As a side-effect the `uint32Array` property will be created (if it did not exist before).
   *
   * @return {Uint32Array}
   */
  toUint32Array() {
    const { uint32Array } = this;
    if (!uint32Array) {
      const elementsPerVO = this.bytesPerVO / Uint32Array.BYTES_PER_ELEMENT;
      this.uint32Array = new Uint32Array(this.buffer, this.bufferByteOffset, this.capacity * elementsPerVO);
      return this.uint32Array;
    }
    return uint32Array;
  }

  /**
   * Create a VOArray *subarray*.
   *
   * A *subarray* is a *view* to the same underlying buffer. No data will be copied.
   *
   * @param {number} begin - Index of first `vertex object`
   * @param {number} [size=1] - Number of `vertex objects` to copy
   *
   * @return {VOArray}
   */
  subarray(begin, size = 1) {
    const { bytesPerVO, bufferByteOffset } = this;
    const byteBegin = bufferByteOffset + (begin * bytesPerVO);
    const byteLength = size * bytesPerVO;

    return new VOArray(size, bytesPerVO, this.arrayTypes, new DataView(this.buffer, byteBegin, byteLength));
  }
}

/** @private */
const BYTES_PER_ELEMENT = {
  float32: 4,
  int16: 2,
  int32: 4,
  int8: 1,
  uint16: 2,
  uint32: 4,
  uint8: 1,
};

/** @private */
const TYPED_ARRAY_GETTER = {
  float32: obj => obj.float32Array,
  int32: obj => obj.int32Array,
  int16: obj => obj.int16Array,
  int8: obj => obj.int8Array,
  uint32: obj => obj.uint32Array,
  uint16: obj => obj.uint16Array,
  uint8: obj => obj.uint8Array,
};

/* eslint no-param-reassign: 0 */

/** @private */
const camelize = name => name[0].toUpperCase() + name.substr(1);

/** @private */
const attrPostfix = (attrDesc, name, index) => {
  if (attrDesc.scalars) {
    const postfix = attrDesc.scalars[index];

    if (postfix !== undefined) {
      return postfix;
    }
  }

  return `${name}_${index}`;
};

/** @private */
const getVNu = (getArray, offset) => function (attrIndex) {
  return getArray(this.voArray)[offset + attrIndex];
};

/** @private */
const setVNu = (getArray, vectorLength, vertexCount, vertexAttrCount, offset) => function () {
  const arr = getArray(this.voArray);

  for (let i = 0; i < vertexCount; ++i) {
    for (let n = 0; n < vectorLength; ++n) {
      arr[(i * vertexAttrCount) + offset + n] = arguments[n];
    }
  }
};

/** @private */
const getV1u = (getArray, offset) => function () {
  return getArray(this.voArray)[offset];
};

/** @private */
const setVNv = (getArray, vectorLength, vertexCount, vertexAttrCount, offset) => function () {
  const arr = getArray(this.voArray);

  for (let i = 0; i < vertexCount; ++i) {
    for (let n = 0; n < vectorLength; ++n) {
      arr[(i * vertexAttrCount) + offset + n] = arguments[(i * vectorLength) + n];
    }
  }
};

/** @private */
const setV1u = (getArray, vertexCount, vertexAttrCount, offset) => function (value) {
  const arr = getArray(this.voArray);

  for (let i = 0; i < vertexCount; ++i) {
    arr[(i * vertexAttrCount) + offset] = value;
  }
};

/**
 * Vertex object *attribute* descriptor.
 */
class VOAttrDescriptor {
  /**
   * @param {string} name
   * @param {string} type
   * @param {number} size
   * @param {number} [offset] - either `offset` or `byteOffset` must be specified
   * @param {number} [byteOffset] - either `offset` or `byteOffset` must be specified
   * @param {boolean} uniform
   * @param {string[]} [scalars]
   */
  constructor(name, type, size, offset, byteOffset, uniform, scalars) {
    this.name = name;
    this.type = type;
    this.size = size;
    this.uniform = uniform;
    this.scalars = scalars;

    this.bytesPerElement = BYTES_PER_ELEMENT[this.type];
    this.bytesPerVertex = this.bytesPerElement * size;

    if (typeof byteOffset !== 'number') {
      this.byteOffset = offset * this.bytesPerElement;
    } else {
      this.byteOffset = byteOffset;
    }

    if (typeof offset !== 'number') {
      this.offset = byteOffset / this.bytesPerElement;
    } else {
      this.offset = offset;
    }
  }

  /**
   * Number of attributes per vertex
   * @type {number}
   */
  vertexAttrCount(descriptor) {
    return descriptor.bytesPerVertex / this.bytesPerElement;
  }

  /**
   * @private
   */
  static defineProperties(attrDesc, propertiesObject, descriptor) {
    const { name } = attrDesc;
    const getArray = TYPED_ARRAY_GETTER[attrDesc.type];
    const { vertexCount } = descriptor;
    const vertexAttrCount = attrDesc.vertexAttrCount(descriptor);
    const offset = attrDesc.byteOffset / attrDesc.bytesPerElement;

    if (attrDesc.size === 1) {
      if (attrDesc.uniform) {
        const valueGetter = getV1u(getArray, offset);
        const valueSetter = setV1u(getArray, vertexCount, vertexAttrCount, offset);

        attrDesc.getValue = vo => valueGetter.call(vo);
        attrDesc.setValue = (vo, arg) => valueSetter.call(vo, arg);

        propertiesObject[name] = {
          get: valueGetter,
          set: valueSetter,
          enumerable: true,
        };
      } else {
        const valueSetter = setVNv(getArray, 1, vertexCount, vertexAttrCount, offset);

        attrDesc.setValue = (vo, args) => valueSetter.apply(vo, args);

        propertiesObject[`set${camelize(name)}`] = {
          value: valueSetter,
          enumerable: true,
        };

        const valueGetters = [];

        for (let i = 0; i < descriptor.vertexCount; ++i) {
          const curValueGetter = getV1u(getArray, offset + (i * vertexAttrCount));

          valueGetters.push(curValueGetter);

          propertiesObject[name + i] = {
            get: curValueGetter,
            set: setVNv(getArray, 1, 1, 0, offset + (i * vertexAttrCount)),
            enumerable: true,
          };
        }

        attrDesc.getValue = (vo, vi) => valueGetters[vi].call(vo);
      }
    } else if (attrDesc.size >= 2) {
      if (attrDesc.uniform) {
        const valueGetter = getVNu(getArray, offset);
        const valueSetter = setVNu(getArray, attrDesc.size, vertexCount, vertexAttrCount, offset);

        attrDesc.getValue = (vo, vi, idx) => valueGetter.call(vo, idx);
        attrDesc.setValue = (vo, args) => valueSetter.apply(vo, args);

        propertiesObject[`get${camelize(name)}`] = {
          value: valueGetter,
          enumerable: true,
        };

        propertiesObject[`set${camelize(name)}`] = {
          value: valueSetter,
          enumerable: true,
        };

        for (let i = 0; i < attrDesc.size; ++i) {
          const setterName = attrPostfix(attrDesc, name, i);

          propertiesObject[setterName] = {
            get: getV1u(getArray, offset + i),
            set: setV1u(getArray, vertexCount, vertexAttrCount, offset + i),
            enumerable: true,
          };
        }
      } else {
        const valueSetter = setVNv(getArray, attrDesc.size, vertexCount, vertexAttrCount, offset);

        attrDesc.setValue = (vo, args) => valueSetter.apply(vo, args);

        propertiesObject[`set${camelize(name)}`] = {
          value: valueSetter,
          enumerable: true,
        };

        const valueGetters = [];

        for (let i = 0; i < descriptor.vertexCount; ++i) {
          const curVertexValueGetters = [];

          for (let j = 0; j < attrDesc.size; ++j) {
            const setterName = attrPostfix(attrDesc, name, j) + i;
            const curValueGetter = getV1u(getArray, offset + (i * vertexAttrCount) + j);

            curVertexValueGetters.push(curValueGetter);

            propertiesObject[setterName] = {
              get: curValueGetter,
              set: setVNv(getArray, 1, 1, 0, offset + (i * vertexAttrCount) + j),
              enumerable: true,
            };
          }

          valueGetters.push(curVertexValueGetters);
        }

        attrDesc.getValue = (vo, vi, idx) => valueGetters[vi][idx].call(vo);
      }
    }
  }
}

/* eslint no-param-reassign: 0 */

const DEFAULT_ATTR_TYPE = 'float32';

/** @private */
var createAttributes = (descriptor, attributesOrObject) => {
  let attributes;

  if (Array.isArray(attributesOrObject)) {
    attributes = attributesOrObject;
  } else if (typeof attributesOrObject === 'object') {
    attributes = Object.keys(attributesOrObject).map((name) => {
      const attrConf = attributesOrObject[name];
      return Object.assign({ name }, (Array.isArray(attrConf) ? { scalars: attrConf } : attrConf));
    });
  }

  if (!attributes) {
    throw new Error('VODescriptor:createAttributes: attributes should be an array or an object!');
  }

  descriptor.attr = {};
  descriptor.scalars = [];

  let offset = 0;
  let byteOffset = 0;

  for (let i = 0; i < attributes.length; ++i) {
    const attr = attributes[i];

    let attrSize = attr.size;
    if (attrSize === undefined) {
      if (Array.isArray(attr.scalars)) {
        attrSize = attr.scalars.length;
      } else {
        attrSize = 1;
        // throw new Error('VODescriptor:createAttributes: attribute descriptor has no :size (or :scalars) property!');
      }
    }

    const type = attr.type || DEFAULT_ATTR_TYPE;

    if (attr.name !== undefined) {
      descriptor.scalars.push(attr.name);
      descriptor.attr[attr.name] = new VOAttrDescriptor(attr.name, type, attrSize, offset, byteOffset, !!attr.uniform, attr.scalars);
    }

    offset += attrSize;
    byteOffset += BYTES_PER_ELEMENT[type] * attrSize;
  }

  // bytes per vertex is always aligned to 4-bytes!
  descriptor.rightPadBytesPerVertex = byteOffset % 4 > 0 ? 4 - (byteOffset % 4) : 0;

  descriptor.bytesPerVertex = byteOffset + descriptor.rightPadBytesPerVertex;
  descriptor.bytesPerVO = descriptor.bytesPerVertex * descriptor.vertexCount;
  descriptor.vertexAttrCount = offset;

  descriptor.attrList = descriptor.scalars.map(name => descriptor.attr[name]);
};

/* eslint no-param-reassign: 0 */

/** @private */
var createAliases = (descriptor, aliases) => {
  if (typeof aliases !== 'object') return;

  Object.keys(aliases).forEach((name) => {
    let attr = aliases[name];

    if (typeof attr === 'string') {
      attr = descriptor.attr[attr];

      if (attr !== undefined) {
        descriptor.attr[name] = attr;
      }
    } else {
      descriptor.attr[name] = new VOAttrDescriptor(name, attr.type, attr.size, attr.offset, attr.byteOffset, !!attr.uniform, attr.scalars);
    }
  });
};

/* eslint func-names: 0 */

/** @private */
const toArray = descriptor => function (scalars) {
  const arr = [];
  const attrList = Array.isArray(scalars)
    ? scalars.map(name => descriptor.attr[name])
    : descriptor.attrList;
  const len = attrList.length;

  for (let i = 0; i < descriptor.vertexCount; ++i) {
    for (let j = 0; j < len; ++j) {
      const attr = attrList[j];
      for (let k = 0; k < attr.size; ++k) {
        arr.push(attr.getValue(this, i, k));
      }
    }
  }
  return arr;
};

/** @private */
var createVOPrototype = (descriptor, proto = {}) => {
  const propertiesObject = {
    toArray: {
      value: toArray(descriptor),
    },
  };

  Object.keys(descriptor.attr).forEach((name) => {
    const attr = descriptor.attr[name];

    VOAttrDescriptor.defineProperties(attr, propertiesObject, descriptor);
  });

  descriptor.voPrototype = Object.create(proto, propertiesObject);
};

/* eslint no-param-reassign: 0 */

/** @private */
var createTypedArrays = (descriptor) => {
  descriptor.typedArrays = {
    float32: false,
    int16: false,
    int32: false,
    int8: false,
    uint16: false,
    uint32: false,
    uint8: false,
  };

  Object.keys(descriptor.attr).forEach((name) => {
    descriptor.typedArrays[descriptor.attr[name].type] = true;
  });

  descriptor.typeList = Object.keys(descriptor.typedArrays).filter(type => descriptor.typedArrays[type]).sort();
};

/* eslint no-param-reassign: 0 */

/** @private */
var createVO = (obj, descriptor, voArray) => {
  // set VODescriptor
  //
  obj.descriptor = descriptor; // || (voArray ? voArray.descriptor : null);

  if (!obj.descriptor) {
    throw new Error('VODescriptor:createVO: could not read descriptor!');
  }

  // set VOArray
  //
  obj.voArray = voArray || obj.descriptor.createVOArray();

  if (obj.descriptor.bytesPerVO !== obj.voArray.bytesPerVO &&
    (obj.descriptor.typeList.join() !== obj.voArray.arrayTypes.join())) {
    throw new TypeError('VODescriptor:createVO: descriptor and voArray are not compatible with each other!');
  }

  return obj;
};

/**
 * Vertex object descriptor.
 *
 * @class VODescriptor
 *
 * @param {Object} options
 * @param {number} [options.vertexCount=1] - number of vertices
 * @param {Object[]} options.attributes - list of vertex attribute descriptions (see example)
 * @param {Object} [options.aliases] - *optional* list of attribute aliases
 * @param {Object} [options.proto]
 *
 * @example
 * const descriptor = new VODescriptor({
 *
 *     proto: {
 *         foo() {
 *             return this.voArray.float32Array[0];
 *         }
 *     },
 *
 *     // vertex buffer layout
 *     // --------------------
 *     //
 *     // v0: (x0)(y0)(z0)(rotate)(s0)(t0)(tx)(ty)(scale)(opacity)
 *     // v1: (x1)(y1)(z1)(rotate)(s1)(t1)(tx)(ty)(scale)(opacity)
 *     // v2: (x2)(y2)(z2)(rotate)(s2)(t2)(tx)(ty)(scale)(opacity)
 *     // v3: (x3)(y3)(z3)(rotate)(s3)(t3)(tx)(ty)(scale)(opacity)
 *     //
 *     vertexCount: 4,
 *
 *     attributes: [
 *
 *         { name: 'position',  type: 'float32', size: 3, scalars: [ 'x', 'y', 'z' ] },
 *         { name: 'rotate',    type: 'float32', size: 1, uniform: true },
 *         { name: 'texCoords', type: 'float32', size: 2, scalars: [ 's', 't' ] },
 *         { name: 'translate', type: 'float32', size: 2, scalars: [ 'tx', 'ty' ], uniform: true },
 *         { name: 'scale',     type: 'float32', size: 1, uniform: true },
 *         { name: 'opacity',   type: 'float32', size: 1, uniform: true }
 *
 *     ],
 *
 *     aliases: {
 *
 *         pos2d: { size: 2, type: 'float32', offset: 0 },
 *         posZ:  { size: 1, type: 'float32', offset: 2, uniform: true },
 *         r:     { size: 1, type: 'float32', offset: 3 },
 *         uv:    'texCoords',
 *
 *     }
 *
 * });
 *
 */
class VODescriptor {
  constructor({
    vertexCount,
    instanceOf,
    attributes,
    aliases,
    proto,
  }) {
    /** Number of _vertices_ per _vertex object_ */
    this.vertexCount = parseInt(vertexCount, 10) || 1;

    /** Returns `true` if this vertex object is *instanced* */
    this.isInstanced = instanceOf != null;

    /** @type VODescriptor */
    this.base = instanceOf;

    createAttributes(this, attributes);
    createAliases(this, aliases);
    createVOPrototype(this, proto);
    createTypedArrays(this);
  }

  /**
   * @param {number} [size=1]
   * @param {Object} [hints] - Optional *hints* for the `VOArray`
   * @returns {VOArray}
   */
  createVOArray(size = 1, hints = undefined) {
    return new VOArray(size, this.bytesPerVO, this.typeList, null, Object.assign({
      descriptor: this,
      usage: 'dynamic',
      doubleBuffer: true,
    }, hints));
  }

  /**
   * Create a *vertex object*.
   *
   * @param {VOArray} [voArray]
   * @param {function|object} [voInit] - *vertex object* initializer
   * @returns {Object} the initialized *vertex object*
   */
  createVO(voArray, voInit) {
    const vo = createVO(Object.create(this.voPrototype), this, voArray);

    switch (typeof voInit) { // eslint-disable-line
      case 'function':
        voInit(vo);
        break;

      case 'object': {
        Object.keys(voInit).forEach((key) => {
          const attrDesc = this.attr[key];
          if (attrDesc) {
            attrDesc.setValue(vo, voInit[key]);
          } else if (typeof vo[key] === 'function') {
            vo[key](voInit[key]);
          } else {
            vo[key] = voInit[key];
          }
        });
      }
    }

    return vo;
  }

  /**
   * Check if *descriptor* has an attribute with a specific size.
   *
   * @param {string} name
   * @param {number} [size=1] - attribute items count
   * @returns {boolean}
   */
  hasAttribute(name, size = 1) {
    const attr = this.attr[name];
    return attr && attr.size === size;
  }

  /**
   * Max number of vertex objects when a vertex buffer is used together
   * with a indexed element array to draw primitives. the reason for
   * such a limit is that webgl restricts element array indices
   * to an uint16 data type.
   * @type {number}
   */
  get maxIndexedVOPoolSize() {
    return Math.floor(65536 / this.vertexCount);
  }
}

/* eslint-env browser */

class ShaderSource {
  /**
   * @param {string} type - `VERTEX_SHADER`, `FRAGMENT_SHADER` or `PARTIAL`
   * @param {HTMLElement|Array<string>|string} source
   * @param {string} [id]
   * @param {Object} [ctx]
   */
  constructor(type, source, id, ctx) {
    /**
     * @type {string}
     */
    this.id = id || uuid();

    /**
     * @type {string}
     */
    this.type = type;

    /** @private */
    this.ctx = Object.assign({}, ctx);

    if (source instanceof HTMLElement) {
      this.strings = [source.textContent];
      this.values = [];
    } else if (Array.isArray(source)) {
      [this.strings, this.values] = source;
    } else {
      this.strings = [String(source)];
      this.values = [];
    }
  }

  /**
   * @param {Object} [context]
   * @returns {string} - The final shader source code.
   */
  compile(context) {
    const source = [this.strings[0]];
    const ctx = Object.assign({}, this.ctx, context);
    this.values.forEach((value, i) => {
      let val = value;
      if (typeof value === 'function') {
        val = value(ctx);
      } else if (value instanceof ShaderSource) {
        if (value.type !== ShaderSource.PARTIAL) {
          throw new Error(`ShaderSource.compile() panic! Only PARTIAL's are allowed to embed into shader sources! (but type=${value.type})`);
        }
        val = value.compile(ctx);
      }
      source.push(val, this.strings[i + 1]);
    });
    return source.join('');
  }
}

ShaderSource.VERTEX_SHADER = 'VERTEX_SHADER';
ShaderSource.FRAGMENT_SHADER = 'FRAGMENT_SHADER';
ShaderSource.PARTIAL = 'PARTIAL';

ShaderSource.vertexShader = ctx => (strings, ...values) => new ShaderSource(ShaderSource.VERTEX_SHADER, [strings, values], ctx && ctx.id, ctx);
ShaderSource.fragmentShader = ctx => (strings, ...values) => new ShaderSource(ShaderSource.FRAGMENT_SHADER, [strings, values], ctx && ctx.id, ctx);
ShaderSource.partial = ctx => (strings, ...values) => new ShaderSource(ShaderSource.PARTIAL, [strings, values], ctx && ctx.id, ctx);

ShaderSource.fromElement = (el) => {
  let type = el.getAttribute('type');
  if (type === 'x-shader/vertex') {
    type = ShaderSource.VERTEX_SHADER;
  } else if (type === 'x-shader/fragment') {
    type = ShaderSource.FRAGMENT_SHADER;
  } else {
    throw new Error(`ShaderSource.fromElement() panic! Invalid type="${type}" attribute value (should be "x-shader/vertex" or "x-shader/fragment")`);
  }
  return new ShaderSource(type, el, el.getAttribute('id'));
};

class ResourceLibrary {
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

/**
 * Shader attribute variable.
 */
class ShaderAttribVariable extends ShaderVariable {
  /**
   * @param {string} name
   * @param {number|Object} value
   */
  constructor(name, value) {
    super(name, ShaderVariable.ATTRIB, value);
  }
}

/**
 * Group of shader variables.
 * @private
 */
class ShaderVariableGroup {
  /**
  * @param {Array<ShaderVariable|ShaderVariableAlias>} shaderVars
   */
  constructor(shaderVars) {
    this.shaderVars = shaderVars;
  }

  pushVar(shaderContext) {
    this.shaderVars.forEach(shaderContext.pushVar.bind(shaderContext));
  }

  popVar(shaderContext) {
    this.shaderVars.forEach(shaderContext.popVar.bind(shaderContext));
  }
}

/**
 * @private
 */
function shaderVarMap(shaderContext, type) {
  switch (type) {
    case ShaderVariable.UNIFORM:
      return shaderContext.uniform;
    case ShaderVariable.ATTRIB:
      return shaderContext.attrib;
    case ShaderVariable.TEXTURE_2D:
      return shaderContext.tex2d;
    default:
      return null;
  }
}

/**
 * @private
 */
function shaderVarLane(shaderContext, type, name) {
  const map = shaderVarMap(shaderContext, type);
  let lane = map.get(name);

  if (!lane) {
    lane = [];
    map.set(name, lane);
  }

  return lane;
}

/**
 * A ShaderContext keeps named references to all shader _variables_
 * to make them available for shader _programs_.
 * Each named reference is organized as a _stack_ where you can push
 * or pop shader variable _values_.
 */
class ShaderContext {
  constructor() {
    this.uniform = new Map();
    this.attrib = new Map();
    this.tex2d = new Map();
  }

  clear() {
    this.uniform.clear();
    this.attrib.clear();
    this.tex2d.clear();
  }

  /**
   * @param {ShaderVariable|ShaderVariableGroup} shaderVariable
   */
  pushVar(shaderVariable) {
    if (shaderVariable instanceof ShaderVariableGroup) {
      shaderVariable.pushVar(this);
    } else {
      const lane = shaderVarLane(this, shaderVariable.type, shaderVariable.name);
      lane.push(shaderVariable);
    }
  }

  /**
   * Remove current shader variable plus all later set variables from named shader variable stack.
   * @param {ShaderVariable|ShaderVariableGroup} shaderVariable
   */
  popVar(shaderVariable) {
    if (shaderVariable instanceof ShaderVariableGroup) {
      shaderVariable.popVar(this);
    } else {
      const lane = shaderVarLane(this, shaderVariable.type, shaderVariable.name);
      const len = lane.length;
      for (let i = 0; i < len; ++i) {
        if (lane[i] === shaderVariable) {
          lane.length = i;
          return;
        }
      }
    }
  }

  /**
   * Return current shader variable by name and type.
   * @param {ShaderVariable} shaderVariable
   * @return {ShaderVariable} or `null`
   */
  curVar(shaderVariable) {
    const lane = shaderVarMap(this, shaderVariable.type).get(shaderVariable.name);
    return lane && lane.length ? lane[lane.length - 1] : null;
  }

  /**
   * Return current _uniform_ shader variable by name.
   * @param {string} name
   * @return {ShaderUniformVariable} or `null`
   */
  curUniform(name) {
    const lane = this.uniform.get(name);
    return lane && lane.length ? lane[lane.length - 1] : null;
  }

  /**
   * Return current _attribute_ shader variable by name.
   * @param {string} name
   * @return {ShaderAttribVariable} or `null`
   */
  curAttrib(name) {
    const lane = this.attrib.get(name);
    return lane && lane.length ? lane[lane.length - 1] : null;
  }

  /**
   * Return current _texture2d_ shader variable by name.
   * @param {string} name
   * @return {ShaderTexture2dVariable} or `null`
   */
  curTex2d(name) {
    const lane = this.tex2d.get(name);
    return lane && lane.length ? lane[lane.length - 1] : null;
  }
}

class ShaderProgram {
  /**
   * @param {ShaderSource} vertexShader
   * @param {ShaderSource} fragmentShader
   * @param {string} [id] id
   */
  constructor(vertexShader, fragmentShader, id) {
    /**
     * @type {string}
     */
    this.id = id || uuid();

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

/**
 * Group of shader uniforms
 */
class ShaderUniformGroup extends ShaderVariableGroup {
  constructor(uniforms) {
    super([]);
    Object.keys(uniforms).forEach((name) => {
      this.addUniform(name, uniforms[name]);
    });
  }

  /**
   * @param {string} name
   * @param {number|Object} value
   * @param {Object} [hints]
   */
  addUniform(name, value, hints) {
    const isProjection = value instanceof Projection;
    const uniform = isProjection
      ? new ProjectionUniform(value, name)
      : new ShaderUniformVariable(name, value, hints);

    this.shaderVars.push(uniform);

    Object.defineProperty(this, `${name}Uniform`, {
      value: uniform,
      enumerable: true,
    });

    if (isProjection) {
      Object.defineProperty(this, name, {
        enumerable: true,
        get: () => uniform.projection,
      });
    } else {
      Object.defineProperty(this, name, {
        enumerable: true,
        get: () => uniform.data,
        set: (data) => {
          uniform.data = data;
        },
      });
    }
  }
}

/**
 * @private
 */
class ShaderAttribValue {
  constructor(name, descriptor, bufferSource) {
    this.name = name;
    this.descriptor = descriptor;
    this.bufferSource = bufferSource;
  }

  set bufferSource(source) {
    this.bufferSource_ = source;
    this.ref = source instanceof VOArray ? source.ref : source.voArray.ref;
  }

  get bufferSource() {
    return this.bufferSource_;
  }

  get attrDescriptor() {
    return this.descriptor.attr[this.name];
  }
}

/**
 * Shader attribute variable *alias*.
 * @private
 */
class ShaderVariableAlias {
  /**
   * @param {string} name
   * @param {number|Object} value
   */
  constructor(name, shaderVar) {
    this.name = name;
    this.shaderVar = shaderVar;
  }

  get type() {
    return this.shaderVar.type;
  }

  get data() {
    return this.shaderVar.data;
  }

  get serial() {
    return this.shaderVar.serial;
  }
}

/**
 * A group of shader variables all referencing the same array buffer.
 * @private
 */
class ShaderVariableBufferGroup extends ShaderVariableGroup {
  /**
   * @param {VOPool|VOArray} bufferSource
   * @param {VODescriptor} descriptor, only needed if `bufferSource` is an `VOArray`
   */
  constructor(bufferSource, voDescriptor) {
    super([]);
    const descriptor = voDescriptor || bufferSource.descriptor;
    let firstVar;
    Object.keys(descriptor.attr).forEach((attrName) => {
      if (!firstVar) {
        firstVar = new ShaderAttribVariable(
          attrName,
          new ShaderAttribValue(
            attrName,
            descriptor,
            bufferSource,
          ),
        );
        this.shaderVars.push(firstVar);
      } else {
        this.shaderVars.push(new ShaderVariableAlias(attrName, firstVar));
      }
    });
  }

  get bufferSource() {
    return this.shaderVars[0].data.bufferSource;
  }

  get serial() {
    return this.shaderVars[0].serial;
  }

  touch() {
    return this.shaderVars[0].touch();
  }
}

/**
 * Pre-allocate a bunch of vertex objects.
 * @returns {number} number of allocated vertex objects
 * @private
 */
var createVOs = (voPool, maxAllocSize = 0) => {
  const max = voPool.capacity - voPool.usedCount - voPool.allocatedCount;
  const count = (maxAllocSize > 0 && maxAllocSize < max ? maxAllocSize : max);
  const len = voPool.allocatedCount + count;

  for (let i = voPool.allocatedCount; i < len; i++) {
    const voArray = voPool.voArray.subarray(i);
    const vertexObject = voPool.descriptor.createVO(voArray);

    vertexObject.free = voPool.free.bind(voPool, vertexObject);

    voPool.availableVOs.push(vertexObject);
  }

  return count;
};

/* eslint no-param-reassign: 0 */

class VOPool {
  /**
   * @param {VODescriptor} descriptor - vertex object descriptor
   * @param {Object} [options] - Advanced options
   * @param {number} [options.capacity] - Maximum number of *vertex objects*
   * @param {VOArray} [options.voArray] - Vertex object array
   * @param {VertexObject} [options.voZero] - *vertex object* prototype
   * @param {VertexObject} [options.voNew] - *vertex object* prototype
   * @param {number} [options.maxAllocVOSize] - never allocate more than `maxAllocVOSize` *vertex objects* at once
   * @param {string} [options.usage='dynamic'] - buffer `usage` hint, choose between `dynamic` or `static`
   * @param {string} [options.doubleBuffer] - buffer `doubleBuffer` hint, set to `true` (which is the default if `usage` equals to `dynamic`) or `false`.
   * @param {string} [options.autotouch] - auto touch vertex buffers hint, set to `true` (which is the default if `usage` equals to `dynamic`) or `false`.
   */

  constructor(descriptor, options) {
    this.id = uuid();
    this.descriptor = descriptor;
    this.capacity = utils.readOption(options, 'capacity', this.descriptor.maxIndexedVOPoolSize);
    this.maxAllocVOSize = utils.readOption(options, 'maxAllocVOSize', 0);
    this.voZero = utils.readOption(options, 'voZero', () => descriptor.createVO());
    this.voNew = utils.readOption(options, 'voNew', () => descriptor.createVO());
    this.usage = utils.readOption(options, 'usage', 'dynamic');
    this.voArray = utils.readOption(options, 'voArray', () => descriptor.createVOArray(this.capacity, {
      usage: this.usage,
      autotouch: utils.readOption(options, 'autotouch', this.usage === 'dynamic'),
      doubleBuffer: utils.readOption(options, 'doubleBuffer', this.usage === 'dynamic'),
      // TODO tripleBuffer / read and write to different buffers for dynamic...
    }));

    this.availableVOs = [];
    this.usedVOs = [];

    createVOs(this, this.maxAllocVOSize);
  }

  /**
   * Number of in use *vertex objects*.
   * @type {number}
   */

  get usedCount() {
    return this.usedVOs.length;
  }

  /**
   * Number of free and unused *vertex objects*.
   * @type {number}
   */

  get availableCount() {
    return this.capacity - this.usedVOs.length;
  }

  /**
   * Number of **allocated** *vertex objects*.
   * @type {number}
   */

  get allocatedCount() {
    return this.availableVOs.length + this.usedVOs.length;
  }

  /**
   * Allocate a *vertex object*
   * @return {VertexObject}
   */

  alloc() {
    let vo = this.availableVOs.shift();

    if (vo === undefined) {
      if ((this.capacity - this.allocatedCount) > 0) {
        createVOs(this, this.maxAllocVOSize);
        vo = this.availableVOs.shift();
      } else {
        return;
      }
    }

    this.usedVOs.push(vo);
    vo.voArray.copy(this.voNew.voArray);

    return vo;
  }

  /**
   * Allocate multiple *vertex objects*
   * @return {VertexObject[]}
   */

  multiAlloc(size, targetArray = []) {
    if ((this.allocatedCount - this.usedCount) < size) {
      createVOs(this, utils.maxOf(this.maxAllocVOSize, size - this.allocatedCount - this.usedCount));
    }
    for (let i = 0; i < size; ++i) {
      const vo = this.availableVOs.shift();
      if (vo !== undefined) {
        this.usedVOs.push(vo);
        vo.voArray.copy(this.voNew.voArray);
        targetArray.push(vo);
      } else {
        break;
      }
    }
    return targetArray;
  }

  /**
   * @param {VertexObject|VertexObject[]} vo - vertex object(s)
   */

  free(vo) {
    if (Array.isArray(vo)) {
      vo.forEach(this.free.bind(this));
      return;
    }

    const idx = this.usedVOs.indexOf(vo);

    if (idx === -1) return;

    const lastIdx = this.usedVOs.length - 1;

    if (idx !== lastIdx) {
      const last = this.usedVOs[lastIdx];
      vo.voArray.copy(last.voArray);

      const tmp = last.voArray;
      last.voArray = vo.voArray;
      vo.voArray = tmp;

      this.usedVOs.splice(idx, 1, last);
    }

    this.usedVOs.pop();
    this.availableVOs.unshift(vo);

    vo.voArray.copy(this.voZero.voArray);
  }
}

/** @private */
const pickVOPoolOpts = utils.pick([
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
 * @param {SpriteGroup|Object} [options.base] - The *base sprite group instance* or the *base sprite group options*
 */
class SpriteGroup {
  constructor(descriptor, options = {}) {
    this.descriptor = descriptor;

    if (options.base instanceof SpriteGroup) {
      this.base = options.base;
    } else if (typeof options.base === 'object') {
      this.base = new SpriteGroup(descriptor.base, options.base);
    }

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
   * Create a sprite.
   * @param {number} [width]
   * @param {number} [height=width]
   * @returns {Object} sprite
   */
  createSprite(width, height) {
    const sprite = this.voPool.alloc();
    const { setSize } = this.spriteHook;
    if (setSize && (width !== undefined || height !== undefined)) {
      setSize(sprite, width, height !== undefined ? height : width, this.descriptor);
    }
    return sprite;
  }

  /**
   * Create multiple sprites at once.
   * @param {number} count - number of sprites to create
   * @param {number} [width]
   * @param {number} [height=width]
   * @returns {Array<Object>} sprites
   */
  createSprites(count, width, height) {
    const sprites = this.voPool.multiAlloc(count);
    const { setSize } = this.spriteHook;
    if (setSize && (width !== undefined || height !== undefined)) {
      const h = height !== undefined ? height : width;
      sprites.forEach(sprite => setSize(sprite, width, h, this.descriptor));
    }
    return sprites;
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

/* eslint no-param-reassign: 0 */

class StackedContext {
  constructor() {
    this.context = new Map();
  }

  push(name, value) {
    const stack = this.context.get(name);
    if (stack) {
      stack.push(value);
      return stack.length - 1;
    }
    this.context.set(name, [value]);
    return 0;
  }

  pop(name, idx) {
    const stack = this.context.get(name);
    if (stack) {
      if (idx === undefined) {
        return stack.pop();
      }
      return stack.splice(idx, stack.length - idx);
    }
  }

  get(name) {
    const stack = this.context.get(name);
    if (stack) {
      const len = stack.length;
      if (len > 0) {
        return stack[len - 1];
      }
    }
  }

  clear() {
    this.context.forEach((value) => {
      value.length = 0;
    });
  }
}

/* eslint-env browser */

/**
 * Represents texture coordinates and holds a reference to an `<img>` or `<canvas>` element.
 * Textures can form hierachical structures:
 * The *root* texture contains always the image reference, all other *sub* textures contain
 * references to their parent (and the root).
 *
 * @class Texture
 *
 * @example
 * const canvas = document.createElement("canvas")
 * const texture = new Texture(canvas)
 * texture.width    // => 300 <- default size of <canvas> element
 * texture.height   // => 150
 *
 * let subTex = new Texture(texture, 30, 15, 100, 100)
 * subTex.width    // => 100
 *
 * Texture.load('test/assets/bird-chicken-penguin.png').then(tex => {
 *   tex.width    // => 640
 *   tex.height   // => 480
 * })
 */

class Texture {
  /**
   * @param {Texture|PowerOf2Image|HTMLImageElement|HTMLCanvasElement} source - image elements must be *completed* (loaded)
   * @param {number} [width]
   * @param {number} [height]
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {Object} [hints] texture hints
   * @param {boolean} [hints.flipY=false]
   * @param {boolean} [hints.repeatable=false]
   * @param {boolean} [hints.premultiplyAlpha=true]
   * @param {boolean} [hints.nearest=true]
   */
  constructor(source, width, height, x = 0, y = 0, hints = undefined) {
    let width_ = width;
    let height_ = height;

    if (source instanceof Texture) {
      /**
       * @type {Texture}
       */
      this.parent = source;
      /**
       * @type {PowerOf2Image|HTMLImageElement|HTMLCanvasElement}
       */
      this.image = null;
    } else if (typeof source === 'object' && 'width' in source && 'height' in source) {
      this.image = source;
      this.parent = null;

      this._ref = new DataRef('Texture', this, {
        flipY: utils.readOption(hints, 'flipY', false),
        repeatable: utils.readOption(hints, 'repeatable', false),
        premultiplyAlpha: utils.readOption(hints, 'premultiplyAlpha', true),
        nearest: utils.readOption(hints, 'nearest', true),
      });

      if ('origWidth' in source && 'origHeight' in source) {
        width_ = source.origWidth;
        height_ = source.origHeight;
      }
    } else {
      throw new Error('new Texture() panic: unexpected source argument!');
    }

    this._width = width_;
    this._height = height_;

    /**
     * @type {number}
     */
    this.x = x;
    /**
     * @type {number}
     */
    this.y = y;
  }

  /**
   * @type {Texture}
   */
  get root() {
    return (this.parent && this.parent.root) || this;
  }

  /**
   * @type {HTMLImageElement|HTMLCanvasElement}
   */
  get imgEl() {
    const { root } = this;
    return root.image.imgEl || root.image;
  }

  /**
   * @type {ResourceRef}
   */
  get ref() {
    return this._ref || this.root.ref;
  }

  /**
   * @type {number}
   */
  get width() {
    return (typeof this._width === 'number'
      ? this._width
      : (this.image
        ? this.image.width
        : (this.parent
          ? this.root.width
          : 0
        )
      )
    );
  }

  set width(w) {
    this._width = w;
  }

  /**
   * @type {number}
   */
  get height() {
    return (typeof this._height === 'number'
      ? this._height
      : (this.image
        ? this.image.height
        : (this.parent
          ? this.root.height
          : 0
        )
      )
    );
  }

  set height(h) {
    this._height = h;
  }

  /**
   * @type {number}
   */
  get minS() {
    let { x } = this;
    let texture = this;

    while ((texture = texture.parent) != null) {  // eslint-disable-line
      x += texture.x;
    }

    return x / this.root.image.width;
  }

  /**
   * @type {number}
   */
  get minT() {
    let { y } = this;
    let texture = this;

    while ((texture = texture.parent) != null) {  // eslint-disable-line
      y += texture.y;
    }

    return y / this.root.image.height;
  }

  /**
   * @type {number}
   */
  get maxS() {
    let x = this.x + this.width;
    let texture = this;

    while ((texture = texture.parent) != null) {  // eslint-disable-line
      x += texture.x;
    }

    return x / this.root.image.width;
  }

  /**
   * @type {number}
   */
  get maxT() {
    let y = this.y + this.height;
    let texture = this;

    while ((texture = texture.parent) != null) {  // eslint-disable-line
      y += texture.y;
    }

    return y / this.root.image.height;
  }

  /**
    * Loads an image from url and returns a texture.
    * @param {string} url
    * @param {object} [textureHints]
    * @returns {Promise<Texture>}
    */
  static async load(url, textureHints) {
    const absoluteUrl = new URL(url, window.location.href).href;
    const p2img = await new PowerOf2Image(absoluteUrl).onLoaded;
    return new Texture(p2img, undefined, undefined, 0, 0, textureHints);
  }
}

/* eslint-env browser */

/**
 * @private
 */
class TextureAtlasJsonDef {
  constructor(jsonDef) {
    this.frameNames = Object.keys(jsonDef.frames);
    this.frames = jsonDef.frames;
    this.meta = jsonDef.meta;
    this.imageUrl = jsonDef.meta.image;
  }

  static async load(url, fetchOptions) {
    const response = await window.fetch(url, fetchOptions);
    const json = await response.json();
    return new TextureAtlasJsonDef(json);
  }
}

/* eslint-env browser */

/**
  * @example
  * TextureAtlas.load('nobinger.json').then(atlas => {
  *   const blau = atlas.frame('nobinger-blau.png')
  *   blau.width   # => 55
  *   blau.height  # => 61
  * })
  */
class TextureAtlas {
  /**
   * @param {Texture} rootTexture
   * @param {TextureAtlasSpec} [jsonDef=null]
   */
  constructor(rootTexture, jsonDef = null) {
    /**
     * @type {Texture}
     */
    this.rootTexture = rootTexture;
    /**
     * @type {TextureAtlasSpec}
     */
    this.jsonDef = jsonDef;
    /**
     * @type {Map<string,Texture>}
     */
    this.frames = new Map();
  }

  /**
   * @param {string} name
   * @param {number} width
   * @param {number} height
   * @param {number} x
   * @param {number} y
   */
  addFrame(name, width, height, x, y) {
    this.frames.set(name, new Texture(this.rootTexture, width, height, x, y));
  }

  /**
   * @param {string} alias - new frame name
   * @param {string} frame - original frame name
   */
  addFrameAlias(alias, frame) {
    if (this.frames.has(frame)) {
      this.frames.set(alias, this.frames.get(frame));
    }
  }

  /**
   * @param {string} name
   * @returns {Texture}
   */
  frame(name) {
    return this.frames.get(name);
  }

  /**
   * @returns {Texture}
   */
  randomFrame() {
    return utils.sample(Array.from(this.frames.values()));
  }

  /**
   * @returns {string}
   */
  randomFrameName() {
    return utils.sample(this.frameNames());
  }

  /**
   * @param {string} [match] - optionally regular expression to filter frame names
   * @returns {Array<string>}
   */
  frameNames(match) {
    const frames = Array.from(this.frames.keys());
    if (match) {
      const regex = new RegExp(match);
      return frames.filter(name => regex.test(name));
    }
    return frames;
  }

  /**
   * Loads a TextureAtlas.
   * @param {string} url - should point to the *texture atlas json def*
   * @param {object} [options] - options
   * @param {object} [optons.fetchOptions] - options for the `fetch()` call
   * @param {string|function|PowerOf2Image|HTMLImageElement|HTMLCanvasElement} [options.image] - by default the image will be loaded from url specified by `meta.image` property from the *texture atlas json def*
   * @param {object} [options.textureHints] - texture hints
   * @returns {Promise<TextureAtlas>}
   */
  static async load(url, options) {
    const atlasUrl = new URL(url, window.location.href).href;
    const jsonDef = await TextureAtlasJsonDef.load(atlasUrl, utils.readOption(options, 'fetchOptions'));
    const image = await new PowerOf2Image(utils.readOption(options, 'image', () => new URL(jsonDef.imageUrl, atlasUrl).href, jsonDef)).onLoaded;

    const rootTexture = new Texture(image, undefined, undefined, 0, 0, utils.readOption(options, 'textureHints'));
    const atlas = new TextureAtlas(rootTexture, jsonDef);

    const { frameNames } = jsonDef;
    const len = frameNames.length;
    for (let i = 0; i < len; i++) {
      const name = frameNames[i];
      const { frame } = jsonDef.frames[name];
      atlas.addFrame(name, frame.w, frame.h, frame.x, frame.y);
    }

    return atlas;
  }
}

class TextureHandle {
  constructor(textureOrAtlas) {
    this.texture = null;
    this.atlas = null;

    this.onReady = Promise.resolve(textureOrAtlas).then(async (toa) => {
      if (toa instanceof TextureAtlas) {
        this.atlas = toa;
        this.texture = toa.rootTexture;
      } else {
        this.texture = toa;
      }
      return toa;
    });
  }
}

/**
 * Shader texture 2d variable.
 * @private
 */
class ShaderTexture2dVariable extends ShaderVariable {
  /**
   * @param {string} name
   * @param {number|Object} value
   */
  constructor(name, value) {
    super(name, ShaderVariable.TEXTURE_2D, value);

    /**
     * @type {Texture}
     */
    this.texture = null;
  }
}

class TextureLibrary {
  constructor() {
    this.handles = new Map();
    this.shaderVars = new Map();
  }

  loadTexture(id, url = id, textureHints = undefined) {
    const th = new TextureHandle(Texture.load(url, textureHints));
    this.handles.set(id, th);
    return th.onReady;
  }

  loadTextureAtlas(id, url = id, textureAtlasOptions = undefined) {
    const th = new TextureHandle(TextureAtlas.load(url, textureAtlasOptions));
    this.handles.set(id, th);
    return th.onReady;
  }

  getTexture(id) {
    const th = this.handles.get(id);
    return th && th.texture;
  }

  getTextureAtlas(id) {
    const th = this.handles.get(id);
    return th && th.atlas;
  }

  whenLoaded(textureId, shaderVarKey, onLoaded) {
    const texture = this.getTexture(textureId);
    if (!texture) return;

    let shaderVar = this.shaderVars.get(shaderVarKey);
    if (!shaderVar) {
      shaderVar = new ShaderTexture2dVariable(shaderVarKey);
      this.shaderVars.set(shaderVarKey, shaderVar);
    }

    shaderVar.texture = texture;
    onLoaded(shaderVar);
  }
}

/**
 * @private
 */
class ShaderTextureGroup {
  constructor(textureLibrary, shaderTextureMap) {
    this.textureLibrary = textureLibrary;
    this.waitFor = Object.keys(shaderTextureMap).map(shaderVarKey => ({
      shaderVarKey,
      textureId: shaderTextureMap[shaderVarKey],
      isLoaded: false,
    }));
    this.shaderVarGroup = new ShaderVariableGroup([]);
    this.shaderVarStore = new Map();
  }

  get isLoaded() {
    return this.waitFor.length === 0 && this.shaderVarGroup.shaderVars.length > 0;
  }

  whenLoaded(onLoaded) {
    if (!this.isLoaded) {
      this.waitFor.forEach((waitFor) => {
        if (!waitFor.isLoaded) {
          const texture = this.textureLibrary.getTexture(waitFor.textureId);
          if (!texture) return;

          const shaderVar = new ShaderTexture2dVariable(waitFor.shaderVarKey);
          shaderVar.texture = texture;
          this.shaderVarGroup.shaderVars.push(shaderVar);

          waitFor.isLoaded = true; // eslint-disable-line
        }
      });

      this.waitFor = this.waitFor.filter(waitFor => waitFor.isLoaded === false);

      if (this.isLoaded) {
        onLoaded(this.shaderVarGroup);
      }
    } else {
      onLoaded(this.shaderVarGroup);
    }
  }
}

class TexturedSpriteGroup extends SpriteGroup {
  constructor(descriptor, options = {}) {
    super(descriptor, options);

    this.textureLibrary = utils.readOption(options, 'textureLibrary', () => new TextureLibrary());

    const { setTexCoordsByTexture } = options;
    if (setTexCoordsByTexture === null || setTexCoordsByTexture === false) {
      this.spriteHook.setTexCoordsByTexture = null;
    } else {
      this.spriteHook.setTexCoordsByTexture = setTexCoordsByTexture || ((sprite, texture) => sprite.setTexCoordsByTexture(texture));
    }

    this.textures = Object.assign({}, options.textures);
    this.shaderTextureGroup = null;
  }

  setTexture(sampler, textureId) {
    if (this.textures[sampler] !== textureId) {
      this.textures[sampler] = textureId;
      this.shaderTextureGroup = null;
    }
  }

  loadTextureAtlas(sampler, url, textureAtlasOptions) {
    this.setTexture(sampler, url);
    return this.textureLibrary.loadTextureAtlas(url, url, textureAtlasOptions);
  }

  getTexture(sampler) {
    return this.textureLibrary.getTexture(this.textures[sampler]);
  }

  getTextureAtlas(sampler) {
    return this.textureLibrary.getTextureAtlas(this.textures[sampler]);
  }

  whenTexturesLoaded(callback) {
    if (!this.shaderTextureGroup) {
      this.shaderTextureGroup = new ShaderTextureGroup(this.textureLibrary, this.textures);
    }

    this.shaderTextureGroup.whenLoaded(callback);
  }

  /**
   * @param {Texture} [texture]
   * @param {number} [width]
   * @param {number} [height=width]
   */
  createSprite(texture, width, height) {
    let w;
    let h;
    if (texture && width === undefined) {
      w = texture.width;
      h = texture.height;
    } else {
      w = width;
      h = height;
    }

    const sprite = super.createSprite(w, h);

    const { setTexCoordsByTexture } = this.spriteHook;
    if (setTexCoordsByTexture && texture) {
      setTexCoordsByTexture(sprite, texture);
    }

    return sprite;
  }
}

class Viewport extends AABB2 {
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

exports.ShaderTool = ShaderTool;
exports.AABB2 = AABB2;
exports.DataRef = DataRef;
exports.ElementIndexArray = ElementIndexArray;
exports.IndexedPrimitive = IndexedPrimitive;
exports.Mat4 = Mat4;
exports.PowerOf2Image = PowerOf2Image;
exports.Projection = Projection;
exports.ProjectionUniform = ProjectionUniform;
exports.ResourceLibrary = ResourceLibrary;
exports.ShaderAttribVariable = ShaderAttribVariable;
exports.ShaderContext = ShaderContext;
exports.ShaderProgram = ShaderProgram;
exports.ShaderSource = ShaderSource;
exports.ShaderUniformGroup = ShaderUniformGroup;
exports.ShaderUniformVariable = ShaderUniformVariable;
exports.ShaderVariableBufferGroup = ShaderVariableBufferGroup;
exports.SpriteGroup = SpriteGroup;
exports.StackedContext = StackedContext;
exports.Texture = Texture;
exports.TextureAtlas = TextureAtlas;
exports.TextureLibrary = TextureLibrary;
exports.TexturedSpriteGroup = TexturedSpriteGroup;
exports.VOArray = VOArray;
exports.VODescriptor = VODescriptor;
exports.VOPool = VOPool;
exports.Viewport = Viewport;
exports.generateUuid = uuid;

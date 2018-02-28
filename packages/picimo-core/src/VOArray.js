// === private === {{{

const TYPED_ARRAY = {
  float32: Float32Array,
  int16: Int16Array,
  int32: Int32Array,
  int8: Int8Array,
  uint16: Uint16Array,
  uint32: Uint32Array,
  uint8: Uint8Array,
};

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

const typedArrayProp = type => `${type}Array`;

const createLinkedTypedArrays = (buffer, arrayTypes) => {
  const { byteLength: bufferByteLength } = buffer;
  const typedArrays = {};

  let bufferByteOffset = 0;
  let arrayBuffer = buffer;

  if (ArrayBuffer.isView(buffer)) {
    bufferByteOffset = buffer.byteOffset;
    arrayBuffer = buffer.buffer;
  }

  arrayTypes.forEach((type) => {
    const TypedArray = TYPED_ARRAY[type];
    const arr = new TypedArray(arrayBuffer, bufferByteOffset, bufferByteLength / TypedArray.BYTES_PER_ELEMENT);
    typedArrays[typedArrayProp(type)] = arr;
  });

  return typedArrays;
};

// --- }}}

export default class VOArray {
  /**
   * @param {number} capacity - Number of `vertex objects`
   * @param {number} bytesPerVO - Size of a single `vertex object` in *bytes*
   * @param {Array<string>} arrayTypes - List of allowed *typed array types*. Should have at least one type included.
   * @param {ArrayBuffer|DataView|TypedArray} [data] - Create a view into data buffer instead of creating a new internal ArrayBuffer
   */
  constructor(capacity, bytesPerVO, arrayTypes, data) {
    this.capacity = capacity;
    this.bytesPerVO = bytesPerVO;
    this.arrayTypes = arrayTypes.slice(0);

    if (data) {
      this.buffer = createBufferView(capacity, bytesPerVO, data);
      this.bufferByteOffset = this.buffer.byteOffset;
      this.arrayBuffer = this.buffer.buffer;
    } else {
      this.arrayBuffer = new ArrayBuffer(capacity * bytesPerVO);
      this.buffer = this.arrayBuffer;
      this.bufferByteOffset = 0;
    }

    Object.assign(this, createLinkedTypedArrays(this.buffer, arrayTypes));
  }

  /**
   * Copy all `vertex object` data from another *array* to this *array*.
   *
   * @desc
   * Both *arrays* should have the same `bytesPerVO`.
   *
   * @param {VOArray} fromVOArray - The source vertex array.
   * @param {number} [toOffset=0] - `vertex object` target offset
   */
  copy(fromVOArray, toOffset = 0) {
    const bytesPerElement = Uint16Array.BYTES_PER_ELEMENT;
    const elementsPerVO = this.bytesPerVO / bytesPerElement;

    const source = new Uint16Array(fromVOArray.arrayBuffer, fromVOArray.bufferByteOffset, fromVOArray.capacity * elementsPerVO);
    const target = new Uint16Array(this.arrayBuffer, this.bufferByteOffset, this.capacity * elementsPerVO);

    let offset = 0;

    if (toOffset > 0) {
      offset = toOffset * elementsPerVO;
    }

    target.set(source, offset);
  }

  /**
   * Create a VOArray *sub* array
   *
   * @desc
   * Instead of copying the internal data - this will create a new view into the internal buffer.
   * Both (the new VOArray and the current one) will share the same memory buffer.
   *
   * @param {number} begin - Index of first `vertex object`
   * @param {number} [size=1] - Number of `vertex objects`
   *
   * @return {VOArray}
   */
  subarray(begin, size = 1) {
    const { bytesPerVO, bufferByteOffset } = this;
    const byteBegin = bufferByteOffset + (begin * bytesPerVO);
    const byteEnd = size * bytesPerVO;

    return new VOArray(size, bytesPerVO, this.arrayTypes, new DataView(this.arrayBuffer, byteBegin, byteEnd));
  }
}

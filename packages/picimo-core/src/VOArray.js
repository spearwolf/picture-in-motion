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

const createTypedArray = (data, capacity, bytesPerVO, TypedArray) => {
  if (data instanceof ArrayBuffer) {
    return new TypedArray(data);
  } else if (data instanceof DataView) {
    return new TypedArray(data.buffer, data.byteOffset, data.byteLength / TypedArray.BYTES_PER_ELEMENT);
  } else if (data != null) {
    return TypedArray.from(data);
  }

  return new TypedArray(new ArrayBuffer(capacity * bytesPerVO));
};

const typedArrayProp = type => `${type}Array`;

const createLinkedTypedArrays = (voArray, attrTypes) => {
  const {
    buffer,
    byteOffset: bufferByteOffset,
    byteLength: bufferByteLength,
  } = voArray.typedArray;

  const arrays = {};

  attrTypes.forEach((type) => {
    const TypedArray = TYPED_ARRAY[type];
    const arr = new TypedArray(buffer, bufferByteOffset, bufferByteLength / TypedArray.BYTES_PER_ELEMENT);
    arrays[typedArrayProp(type)] = arr;
  });

  return arrays;
};

const typedArrayType = voArray => voArray.attrTypes[0];

// --- }}}

export default class VOArray {
  /**
   * @param {number} capacity - Number of `vertex objects`
   * @param {number} bytesPerVO - Size of a single `vertex object` in *bytes*
   * @param {Array<string>} attrTypes - List of allowed *typed array element types*. Should have at least one type included.
   */
  constructor(capacity, bytesPerVO, attrTypes, data) {
    this.capacity = capacity;
    this.bytesPerVO = bytesPerVO;
    this.attrTypes = attrTypes;

    this.typedArray = createTypedArray(data, capacity, bytesPerVO, TYPED_ARRAY[typedArrayType(this)]);

    Object.assign(this, createLinkedTypedArrays(this, attrTypes));
  }

  /**
   * Copy all `vertex object` data from another *array* to this *array*.
   *
   * @desc
   * Both *arrays* should have the same characteristics (`bytesPerVO` and least one of the same `attrType`).
   *
   * @param {VOArray} fromVOArray - The source vertex array.
   * @param {number} [toOffset=0] - `vertex object` target offset
   */
  copy(fromVOArray, toOffset = 0) {
    const typedArray = this[typedArrayProp(typedArrayType(fromVOArray))];

    let offset = 0;

    if (toOffset > 0) {
      offset = toOffset * (this.bytesPerVO / typedArray.BYTES_PER_ELEMENT);
    }

    typedArray.set(fromVOArray.typedArray, offset);
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
    const { bytesPerVO } = this;
    const byteOffset = this.typedArray.byteOffset + (begin * bytesPerVO);
    const byteCount = size * bytesPerVO;

    return new VOArray(size, bytesPerVO, this.attrTypes, new DataView(
      this.typedArray.buffer,
      byteOffset,
      byteCount,
    ));
  }
}

import DataRef from './DataRef';

export default class ElementIndexArray {
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

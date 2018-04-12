import ElementIndexArray from './ElementIndexArray';

export default class IndexedPrimitive {
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

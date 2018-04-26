/* eslint no-param-reassign: 0 */
import { BYTES_PER_ELEMENT } from './typedArrayHelpers';
import VOAttrDescriptor from './VOAttrDescriptor';

const DEFAULT_ATTR_TYPE = 'float32';

/** @private */
export default (descriptor, attributesOrObject) => {
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

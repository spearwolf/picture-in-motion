/* eslint no-param-reassign: 0 */
import { BYTES_PER_ELEMENT } from './typedArrayHelpers';
import VOAttrDescriptor from './VOAttrDescriptor';

const DEFAULT_ATTR_TYPE = 'float32';

/** @private */
export default (descriptor, attributes) => {
  descriptor.attr = {};
  descriptor.attrNames = [];

  if (Array.isArray(attributes)) {
    let offset = 0;
    let byteOffset = 0;

    for (let i = 0; i < attributes.length; ++i) {
      const attr = attributes[i];

      if (attr.size === undefined) throw new Error('VODescriptor:createAttributes: attribute descriptor has no :size property!');

      const type = attr.type || DEFAULT_ATTR_TYPE;

      if (attr.name !== undefined) {
        descriptor.attrNames.push(attr.name);
        descriptor.attr[attr.name] = new VOAttrDescriptor(attr.name, type, attr.size, offset, byteOffset, !!attr.uniform, attr.attrNames);
      }

      offset += attr.size;
      byteOffset += BYTES_PER_ELEMENT[type] * attr.size;
    }

    // bytes per vertex is always aligned to 4-bytes!
    descriptor.rightPadBytesPerVertex = byteOffset % 4 > 0 ? 4 - (byteOffset % 4) : 0;
    descriptor.bytesPerVertex = byteOffset + descriptor.rightPadBytesPerVertex;
    descriptor.bytesPerVO = descriptor.bytesPerVertex * descriptor.vertexCount;
    descriptor.vertexAttrCount = offset;
  }

  descriptor.attrList = descriptor.attrNames.map(name => descriptor.attr[name]);
};

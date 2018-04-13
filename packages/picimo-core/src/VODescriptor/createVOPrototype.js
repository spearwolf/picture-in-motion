/* eslint func-names: 0 */
/* eslint no-param-reassign: 0 */
import VOAttrDescriptor from './VOAttrDescriptor';

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
export default (descriptor, proto = {}) => {
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

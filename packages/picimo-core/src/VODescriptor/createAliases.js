/* eslint no-param-reassign: 0 */
import VOAttrDescriptor from './VOAttrDescriptor';

/** @private */
export default (descriptor, aliases) => {
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

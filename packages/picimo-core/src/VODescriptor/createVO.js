/* eslint no-param-reassign: 0 */

/** @private */
export default (obj, descriptor, voArray) => {
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

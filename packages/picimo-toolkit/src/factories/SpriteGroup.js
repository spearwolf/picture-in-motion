// import {
//   IndexedPrimitive,
//   ElementIndexArray,
// } from '@picimo/core'; // eslint-disable-line

// import {
//   attachDataValues,
//   firstPropertyCallArg,
//   hasPropertyCall,
// } from './utils';

/** @private */
const create = ({ declaration, options }) => {
  console.warn('TODO implementation: create SpriteGroup'); // eslint-disable-line
};

/** @private */
const transform = (parsedTree) => {
  // const { data } = parsedTree;
  const out = {
    _parsedTree: parsedTree,
  };
  // if (hasPropertyCall(data, 'generate')) {
  //   out.generate = true;
  // }
  // attachDataValues(out, data, [
  //   'stride',
  //   'offset',
  //   'indices',
  // ]);
  return out;
};

export {
  create,
  transform,
};

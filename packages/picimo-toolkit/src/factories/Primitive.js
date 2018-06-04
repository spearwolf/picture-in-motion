import {
  IndexedPrimitive,
  ElementIndexArray,
} from '@picimo/core'; // eslint-disable-line

import {
  attachDataValues,
  firstPropertyCallArg,
  hasPropertyCall,
} from './utils';

/** @private */
const create = ({ declaration, options }) => {
  if (declaration.generate) {
    return new IndexedPrimitive(
      declaration.primitiveType,
      ElementIndexArray.Generate(
        options.capacity,
        declaration.indices,
        declaration.stride,
        declaration.offset,
      ),
    );
  }
  console.warn('TODO implementation: Primitive with(out) @generate(no)'); // eslint-disable-line
};

/** @private */
const transform = (parsedTree) => {
  const { data } = parsedTree;
  const out = {
    // _parsedTree: parsedTree,
    primitiveType: firstPropertyCallArg(data, 'type'),
  };
  if (hasPropertyCall(data, 'generate')) {
    out.generate = true;
  }
  attachDataValues(out, data, [
    'stride',
    'offset',
    'indices',
  ]);
  return out;
};

export {
  create,
  transform,
};

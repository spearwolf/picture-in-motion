import {
  attachDataValues,
  firstPropertyCallArg,
  hasPropertyCall,
} from './utils';

/** @private */
const create = ({ declaration, options }) => {
  // TODO
};

/** @private */
const transform = (parsedTree) => {
  const { data } = parsedTree;
  const out = {
    _parsedTree: parsedTree,
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

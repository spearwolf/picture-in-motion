import get from 'lodash/get';

import findPropertyCall from './findPropertyCall';

import {
  DATA,
  DATA_BLOCK,
} from '../constants';

/** @private */
const DEFAULT_ATTR_TYPE = 'float32';

/** @private */
const transform = (parsedTree) => {
  const voNew = {};
  return {
    parsedTree,
    voNew,
    voDescriptor: {
      vertexCount: get(findPropertyCall(parsedTree.data, 'vertexCount'), 'args[0]'),
      attributes: parsedTree.data.filter(({ type }) => type === DATA || type === DATA_BLOCK).map((statement) => {
        const attr = {
          name: statement.name,
        };
        if (statement.type === DATA) {
          attr.type = statement.valueType || DEFAULT_ATTR_TYPE;
        } else if (statement.type === DATA_BLOCK) {
          attr.type = statement.dataType || DEFAULT_ATTR_TYPE;
          attr.scalars = statement.data.filter(({ type }) => type === DATA).map(data => data.name);
          attr.size = attr.scalars.length;
        }
        return attr;
      }),
    },
  };
};

export { transform };

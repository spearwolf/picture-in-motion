import compact from 'lodash/compact';

import { VODescriptor } from '@picimo/core'; // eslint-disable-line

import {
  findNamedArgument,
  findPropertyCall,
  firstPropertyCallArg,
  hasPropertyCall,
  parseVoDefaultValues,
} from './utils';

import {
  DATA,
  DATA_BLOCK,
} from '../constants';


/** @private */
const DEFAULT_ATTR_TYPE = 'float32';


/** @private */
const create = ({ declaration, ctx, options }) => {
  const instanceOf = declaration.verb === 'instantiates' ? ctx.create(declaration.subject) : undefined;
  const { voDescriptor } = declaration;
  const proto = options || voDescriptor.proto;
  return new VODescriptor({
    ...voDescriptor,
    instanceOf,
    proto: typeof proto === 'string' ? ctx.readOption(proto) : proto,
  });
};


/** @private */
const transform = (parsedTree) => {
  const voNew = {};
  const aliases = {};
  const parseVoNewDefaults = parseVoDefaultValues(voNew);
  const out = {
    // _parsedTree: parsedTree,
    voDescriptor: {
      vertexCount: firstPropertyCallArg(parsedTree.data, 'vertexCount'),
      attributes: compact(parsedTree.data.filter(({ type }) => type === DATA || type === DATA_BLOCK).map((statement) => {
        const aliasAnnotation = findPropertyCall(statement.annotations, 'alias');
        if (aliasAnnotation && aliasAnnotation.args && typeof aliasAnnotation.args[0] === 'string') {
          aliases[statement.name] = aliasAnnotation.args[0];  // eslint-disable-line
          return null;
        }
        const attr = {
          name: statement.name,
        };
        if (statement.type === DATA) {
          attr.type = statement.valueType || DEFAULT_ATTR_TYPE;
          findNamedArgument(statement.args, 'size', (size) => {
            attr.size = size;
          });
        } else if (statement.type === DATA_BLOCK) {
          attr.type = statement.dataType || DEFAULT_ATTR_TYPE;
          attr.scalars = statement.data.filter(({ type }) => type === DATA).map(({ name, value }) => {
            parseVoNewDefaults(name, value);
            return name;
          });
          attr.size = attr.scalars.length;
        }
        if (hasPropertyCall(statement.annotations, 'uniform')) {
          attr.uniform = true;
        }
        parseVoNewDefaults(statement.name, statement.value);
        if (aliasAnnotation) {
          findNamedArgument(statement.args, 'offset', (offset) => {
            attr.offset = offset;
          });
          aliases[statement.name] = attr;  // eslint-disable-line
          return null;
        }
        return attr;
      })),
    },
  };
  if (Object.keys(aliases).length) {
    out.voDescriptor.aliases = aliases;
  }
  if (Object.keys(voNew).length) {
    out.voNew = voNew;
  }
  findPropertyCall(parsedTree.data, 'prototype', ({ args }) => {
    out.voDescriptor.proto = args[0]; // eslint-disable-line
  });
  return out;
};

export {
  create,
  transform,
};

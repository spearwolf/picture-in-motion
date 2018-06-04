// import {
//   IndexedPrimitive,
//   ElementIndexArray,
// } from '@picimo/core'; // eslint-disable-line

import {
  attachDataValue,
  findData,
  findNamedArgument,
  findPropertyCall,
  firstPropertyCallArg,
  hasPropertyCall,
  readFlag,
  setByFirstPropertyCallArg,
  setFlagByPropertyCall,
} from './utils';

import { DATA_BLOCK } from '../constants';


/** @private */
const create = ({ declaration, options }) => {
  console.warn('TODO implementation: create SpriteGroup'); // eslint-disable-line
};


/** @private */
const readVoPoolOptions = (data) => {
  const out = {};

  findPropertyCall(data, 'dynamic', (dynamic) => {
    out.usage = readFlag(dynamic, true) ? 'dynamic' : 'static';
  });

  setFlagByPropertyCall(out, data, 'doubleBuffer');
  setFlagByPropertyCall(out, data, 'autotouch');
  setFlagByPropertyCall(out, data, 'textured');

  setByFirstPropertyCallArg(out, 'setSize', data);
  setByFirstPropertyCallArg(out, 'setTexCoordsByTexture', data);

  attachDataValue(out, data, 'capacity');
  attachDataValue(out, data, 'maxAllocVOSize');

  findData(data, 'textures', (textures) => {
    if (textures && textures.type === DATA_BLOCK) {
      const tex = {};
      textures.data.forEach(({ name, value, annotations, args }) => {
        const hints = {};
        tex[name] = {
          hints,
          src: value,
          type: (hasPropertyCall(annotations, 'atlas') ? 'atlas' : 'texture'),
        };
        findNamedArgument(args, 'flipY', (flag) => {
          hints.flipY = flag;
        });
        findNamedArgument(args, 'repeatable', (flag) => {
          hints.repeatable = flag;
        });
        findNamedArgument(args, 'premultiplyAlpha', (flag) => {
          hints.premultiplyAlpha = flag;
        });
        findNamedArgument(args, 'nearest', (flag) => {
          hints.nearest = flag;
        });
      });
      out.textureMap = tex;
    }
  });

  return out;
};


/** @private */
const transform = (parsedTree) => {
  const { data } = parsedTree;
  const voDescriptor = firstPropertyCallArg(data, 'vertexObject');
  const out = {
    voDescriptor,
    // _parsedTree: parsedTree,
    vertexShader: firstPropertyCallArg(data, 'vertexShader'),
    fragmentShader: firstPropertyCallArg(data, 'fragmentShader'),
    primitive: firstPropertyCallArg(data, 'primitive'),
  };
  Object.assign(out, readVoPoolOptions(data));
  if (voDescriptor) {
    findData(data, voDescriptor, (dataBlock) => {
      Object.assign(out, {
        [voDescriptor]: readVoPoolOptions(dataBlock.data, {}),
      });
    });
  }
  return out;
};

export {
  create,
  transform,
};
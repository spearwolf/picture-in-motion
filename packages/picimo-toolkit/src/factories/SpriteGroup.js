/* eslint no-param-reassign: 0 */
import { SpriteGroup } from '@picimo/core'; // eslint-disable-line

import {
  attachDataValue,
  findData,
  findPropertyCall,
  firstPropertyCallArg,
  hasPropertyCall,
  readFlag,
  setByFirstPropertyCallArg,
  setByNamedArgument,
  setFlagByPropertyCall,
} from './utils';

import { DATA_BLOCK } from '../constants';


/** @private */
const readOption = (...options) => (key, defVal = undefined) => options.reduce((curVal, opt) => (opt && key in opt ? opt[key] : curVal), defVal);

/** @private */
const VO_POOL_OPTIONS = [
  'autotouch',
  'capacity',
  'doubleBuffer',
  'maxAllocVOSize',
  'usage',
];

/** @private */
const VO_POOL_CONFIGS = [
  'setSize',
  'setTexCoordsByTexture',
];

/** @private */
const SHADER_OPTIONS = [
  'vertexShader',
  'fragmentShader',
  'shaderProgram',
];

/** @private */
const createPrimitive = (ctx, primitive, capacity) => {
  switch (typeof primitive) {
    case 'string':
      return ctx.create(primitive, { capacity });
    default:
      return primitive;
  }
};

/** @private */
const create = ({ ctx, declaration, options = {} }) => {
  const { voDescriptor: vodKey } = declaration;

  // I. create VoDescriptor
  // ----------------------------------------------------
  const vod = ctx.create(vodKey, options[vodKey]);

  // II. parse and merge options
  // ----------------------------------------------------
  const vodOptions = options[vodKey];
  const readVoPoolOption = readOption(declaration, declaration[vodKey], options, vodOptions);

  const sgOpts = {};
  VO_POOL_OPTIONS.forEach((key) => {
    const val = readVoPoolOption(key);
    if (val !== undefined) {
      sgOpts[key] = val;
    }
  });

  const readVoPoolDeclOption = readOption(declaration, declaration[vodKey]);
  const readVoPoolConfig = readOption(ctx.config, options, vodOptions);

  VO_POOL_CONFIGS.forEach((key) => {
    let val = readVoPoolDeclOption(key);
    if (typeof val === 'string') {
      val = readVoPoolConfig(val);
    }
    if (val !== undefined) {
      sgOpts[key] = val;
    }
  });

  // III. create Primitive
  // ----------------------------------------------------
  sgOpts.primitive = createPrimitive(ctx, declaration.primitive, sgOpts.capacity);

  // IV. create SpriteGroup
  // ----------------------------------------------------
  const readSpriteGroupConfig = readOption(declaration, options);
  SHADER_OPTIONS.forEach((key) => {
    let val = readSpriteGroupConfig(key);
    if (typeof val === 'string') {
      val = ctx.readOption(val);
    }
    if (val !== undefined) {
      sgOpts[key] = val;
    }
  });

  return new SpriteGroup(vod, sgOpts);
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
      out.textureMap = tex;
      textures.data.forEach(({
        name,
        value,
        annotations,
        args,
      }) => {
        const hints = {};
        tex[name] = {
          hints,
          src: value,
          type: (hasPropertyCall(annotations, 'atlas') ? 'atlas' : 'texture'),
        };
        setByNamedArgument(args, hints, 'flipY');
        setByNamedArgument(args, hints, 'repeatable');
        setByNamedArgument(args, hints, 'premultiplyAlpha');
        setByNamedArgument(args, hints, 'nearest');
      });
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
    primitive: firstPropertyCallArg(data, 'primitive'),
  };
  setByFirstPropertyCallArg(out, 'vertexShader', data);
  setByFirstPropertyCallArg(out, 'fragmentShader', data);
  setByFirstPropertyCallArg(out, 'shaderProgram', data);
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

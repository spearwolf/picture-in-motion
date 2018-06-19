/* eslint no-param-reassign: 0 */
import { SpriteGroup } from '@picimo/core'; // eslint-disable-line

import {
  assignOptions,
  attachDataValue,
  findData,
  findPropertyCall,
  firstPropertyCallArg,
  hasPropertyCall,
  readFlag,
  readOption,
  setByFirstPropertyCallArg,
  setByNamedArgument,
  setFlagByPropertyCall,
} from './utils';

import { DATA_BLOCK } from '../constants';

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

  // parse and merge options
  // ----------------------------------------------------
  const vodOptions = options[vodKey];
  const vodDeclaration = declaration[vodKey];
  const ctxReadOption = ctx.readOption.bind(ctx);

  const spriteGroupOptions = assignOptions(
    {}, [
      'autotouch',
      'capacity',
      'doubleBuffer',
      'maxAllocVOSize',
      'usage',
    ],
    readOption(declaration, vodDeclaration, options, vodOptions),
  );

  assignOptions(
    spriteGroupOptions, [
      'setSize',
      'setTexCoordsByTexture',
    ],
    readOption(declaration, vodDeclaration),
    readOption(ctxReadOption, options, vodOptions),
  );

  // create Primitive
  // ----------------------------------------------------
  spriteGroupOptions.primitive = createPrimitive(ctx, declaration.primitive, spriteGroupOptions.capacity);

  // IV. create SpriteGroup
  // ----------------------------------------------------

  assignOptions(
    spriteGroupOptions, [
      'vertexShader',
      'fragmentShader',
      'shaderProgram',
    ],
    readOption(declaration, options),
    readOption(ctxReadOption),
  );

  // create VODescriptor
  // ----------------------------------------------------
  const { prototype } = assignOptions(
    {}, [
      'prototype',
    ],
    readOption(vodDeclaration, vodOptions),
    readOption(ctxReadOption, options),
  );

  const vod = ctx.create(vodKey, prototype);

  // create SpriteGroup
  // ----------------------------------------------------
  return new SpriteGroup(vod, spriteGroupOptions);
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
  setByFirstPropertyCallArg(out, 'prototype', data);

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

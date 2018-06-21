import has from 'lodash/has';
import get from 'lodash/get';
import set from 'lodash/set';
import { pick } from '@picimo/utils'; // eslint-disable-line
import { getLogger } from 'loglevel';

import { parse } from './picimoParser';
import { VertexObject, Primitive, SpriteGroup } from './factories';

import { DECLARATION } from './constants';

const VERTEX_OBJECT = 'vertexobject';
const PRIMITIVE = 'primitive';
const SPRITE_GROUP = 'spritegroup';

/** @private */
const FACTORIES = {
  [VERTEX_OBJECT]: VertexObject,
  [PRIMITIVE]: Primitive,
  [SPRITE_GROUP]: SpriteGroup,
};

/** @private */
const log = getLogger('picimo.toolkit.Context');

/** @private */
const getFactory = (type) => {
  const factory = FACTORIES[type];
  if (!type) {
    log.error('Context: unknown declaration type:', type);
  }
  return factory;
};


/** @private */
const transformDeclaration = (item) => {
  const factory = getFactory(item.declarationType);
  if (factory) {
    return factory.transform(item);
  }
  return item;
};


/** @private */
const createInstanceFromDeclaration = (ctx, name, options) => {
  const declaration = get(ctx.declaration, name);
  if (!declaration) return;

  const factory = getFactory(declaration.declarationType);
  if (factory) {
    return factory.create({
      ctx,
      name,
      declaration,
      options,
    });
  }

  return null;
};

/** @private */
const pickDeclaration = pick([
  'declarationType',
  'verb',
  'subject',
]);

class Context {
  constructor(config) {
    this.config = Object.assign({}, config);
    this.declaration = {};
  }

  hasOption(name) {
    return has(this.config, name);
  }

  readOption(name) {
    return get(this.config, name);
  }

  writeOption(name, value) {
    set(this.config, name, value);
  }

  configure(config) {
    Object.assign(this.config, config);
    return this;
  }

  compile(source, config) {
    if (config) {
      this.configure(config);
    }
    const parsedTree = parse(source, { ctx: this });
    parsedTree.forEach((item) => {
      if (item.type === DECLARATION) {
        set(this.declaration, item.name, Object.assign(transformDeclaration(item), pickDeclaration(item)));
      }
    });
    return this;
  }

  create(name, options) {
    return createInstanceFromDeclaration(this, name, options);
  }
}

const configure = config => new Context(config);

const compile = (source, config) => {
  const ctx = new Context(config);
  return ctx.compile(source);
};

export {
  configure,
  compile,
};

export default Context;

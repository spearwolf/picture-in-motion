import has from 'lodash/has';
import get from 'lodash/get';
import set from 'lodash/set';
import pick from 'lodash/pick';

import { parse } from './picimoParser';
import { VertexObject, Primitive, SpriteGroup } from './factories';

import { DECLARATION } from './constants';

const VERTEX_OBJECT = 'vertexobject';
const PRIMITIVE = 'primitive';
const SPRITE_GROUP = 'spritegroup';

/** @private */
const transformDeclaration = (item) => {
  switch (item.declarationType) {
    case VERTEX_OBJECT:
      return VertexObject.transform(item);

    case PRIMITIVE:
      return Primitive.transform(item);

    case SPRITE_GROUP:
      return SpriteGroup.transform(item);

    default:
      return item;
  }
};


/** @private */
const createInstanceFromDeclaration = (ctx, name, options) => {
  const declaration = get(ctx.declaration, name);
  if (!declaration) return;

  switch (declaration.declarationType) {
    case VERTEX_OBJECT:
      return VertexObject.create({
        ctx,
        name,
        declaration,
        options,
      });

    case PRIMITIVE:
      return Primitive.create({
        ctx,
        name,
        declaration,
        options,
      });

    case SPRITE_GROUP:
      return SpriteGroup.create({
        ctx,
        name,
        declaration,
        options,
      });

    default:
      console.log(`TODO createInstanceFromDeclaration(${declaration.declarationType}, ${name}, ${JSON.stringify(options)}), config=`, ctx.config); // eslint-disable-line
      return null;
  }
};


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
        set(this.declaration, item.name, Object.assign(transformDeclaration(item), pick(item, [
          'declarationType',
          'verb',
          'subject',
        ])));
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

import has from 'lodash/has';
import get from 'lodash/get';
import set from 'lodash/set';

import { parse } from './picimoParser';

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
      if (item.type === 'declaration') {
        set(this.declaration, item.name, item);
      }
    });
    return this;
  }

  create(name, options) {
    console.log(`TODO Context.create(${name}, ${JSON.stringify(options)}), config=`, this.config); // eslint-disable-line
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

/* eslint-env browser */
import generateUuid from './generateUuid';

export default class ShaderSource {
  /**
   * @param {string} type - `VERTEX_SHADER`, `FRAGMENT_SHADER` or `PARTIAL`
   * @param {HTMLElement|Array<string>|string} source
   * @param {string} [id]
   * @param {Object} [ctx]
   */
  constructor(type, source, id, ctx) {
    /**
     * @type {string}
     */
    this.id = id || generateUuid();

    /**
     * @type {string}
     */
    this.type = type;

    /** @private */
    this.ctx = Object.assign({}, ctx);

    if (source instanceof HTMLElement) {
      this.strings = [source.textContent];
      this.values = [];
    } else if (Array.isArray(source)) {
      [this.strings, this.values] = source;
    } else {
      this.strings = [String(source)];
      this.values = [];
    }
  }

  /**
   * @param {Object} [context]
   * @returns {string} - The final shader source code.
   */
  compile(context) {
    const source = [this.strings[0]];
    const ctx = Object.assign({}, this.ctx, context);
    this.values.forEach((value, i) => {
      let val = value;
      if (typeof value === 'function') {
        val = value(ctx);
      } else if (value instanceof ShaderSource) {
        if (value.type !== ShaderSource.PARTIAL) {
          throw new Error(`ShaderSource.compile() panic! Only PARTIAL's are allowed to embed into shader sources! (but type=${value.type})`);
        }
        val = value.compile(ctx);
      }
      source.push(val, this.strings[i + 1]);
    });
    return source.join('');
  }
}

ShaderSource.VERTEX_SHADER = 'VERTEX_SHADER';
ShaderSource.FRAGMENT_SHADER = 'FRAGMENT_SHADER';
ShaderSource.PARTIAL = 'PARTIAL';

ShaderSource.vertexShader = ctx => (strings, ...values) => new ShaderSource(ShaderSource.VERTEX_SHADER, [strings, values], ctx && ctx.id, ctx);
ShaderSource.fragmentShader = ctx => (strings, ...values) => new ShaderSource(ShaderSource.FRAGMENT_SHADER, [strings, values], ctx && ctx.id, ctx);
ShaderSource.partial = ctx => (strings, ...values) => new ShaderSource(ShaderSource.PARTIAL, [strings, values], ctx && ctx.id, ctx);

ShaderSource.fromElement = (el) => {
  let type = el.getAttribute('type');
  if (type === 'x-shader/vertex') {
    type = ShaderSource.VERTEX_SHADER;
  } else if (type === 'x-shader/fragment') {
    type = ShaderSource.FRAGMENT_SHADER;
  } else {
    throw new Error(`ShaderSource.fromElement() panic! Invalid type="${type}" attribute value (should be "x-shader/vertex" or "x-shader/fragment")`);
  }
  return new ShaderSource(type, el, el.getAttribute('id'));
};

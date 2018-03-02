import { readOption } from '@picimo/core'; // eslint-disable-line

/**
 * @private
 */
const readContextAttributes = options => ({
  alpha: readOption(options, 'alpha', false),
  depth: readOption(options, 'depth', true),
  stencil: readOption(options, 'stencil', true),
  antialias: readOption(options, 'antialias', false),
  premultipliedAlpha: readOption(options, 'premultipliedAlpha', true),
  preserveDrawingBuffer: readOption(options, 'preserveDrawingBuffer', false),
});

/**
 * @private
 */
export default (canvas, options) => {
  const ctxAttrs = readContextAttributes(options);

  const gl = canvas.getContext('webgl', ctxAttrs) || canvas.getContext('experimental-webgl', ctxAttrs);

  if (gl == null) {
    throw Error(`WebGlRenderer: could not create webgl context with attributes: ${JSON.stringify(ctxAttrs)}`);
  }

  return gl;
};

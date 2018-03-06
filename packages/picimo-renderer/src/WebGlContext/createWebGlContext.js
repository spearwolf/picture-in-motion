import { readOption } from '@picimo/core'; // eslint-disable-line

import WebGl1Context from './WebGl1Context';
import WebGl2Context from './WebGl2Context';

/**
 * @private
 * @see https://www.khronos.org/registry/webgl/specs/1.0/#WEBGLCONTEXTATTRIBUTES
 */
const readContextAttributes = options => ({
  alpha: readOption(options, 'alpha', false),
  depth: readOption(options, 'depth', true),
  stencil: readOption(options, 'stencil', true),
  antialias: readOption(options, 'antialias', false),
  premultipliedAlpha: readOption(options, 'premultipliedAlpha', true),
  preserveDrawingBuffer: readOption(options, 'preserveDrawingBuffer', false),
  preferLowPowerToHighPerformance: readOption(options, 'preferLowPowerToHighPerformance', false),
  failIfMajorPerformanceCaveat: readOption(options, 'failIfMajorPerformanceCaveat', false),
});

/**
 * @private
 */
export default (canvas, options) => {
  const ctxAttrs = readContextAttributes(options);

  let gl = canvas.getContext('webgl2', ctxAttrs);

  if (gl) {
    return new WebGl2Context(gl);
  }

  gl = canvas.getContext('webgl', ctxAttrs) || canvas.getContext('experimental-webgl', ctxAttrs);

  if (gl == null) {
    throw Error(`createWebGlContext: could not create webgl context with attributes: ${JSON.stringify(ctxAttrs)}`);
  }

  return new WebGl1Context(gl);
};

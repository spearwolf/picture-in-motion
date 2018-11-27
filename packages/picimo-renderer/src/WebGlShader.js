import loglevel from 'loglevel';
import { ShaderSource } from '@picimo/core';  // eslint-disable-line

const log = loglevel.getLogger('picimo.renderer.WebGlShader');

/** @private */
const compileShader = (shader) => {
  const { gl } = shader.glx;
  const { glShader, source } = shader;

  const src = source.compile({ glx: shader.glx });

  gl.shaderSource(glShader, src);
  gl.compileShader(glShader);

  if (!gl.getShaderParameter(glShader, gl.COMPILE_STATUS)) {
    const shaderInfoLog = gl.getShaderInfoLog(glShader);

    log.debug(`WebGlShader: vertex shader source =>\n${src}`);
    throw new Error(`WebGlShader: gl.compileShader(..) panic!\n${shaderInfoLog}`);
  }
};

export default class WebGlShader {
  constructor(glx, source) {
    this.glx = glx;

    if (!(source instanceof ShaderSource)) {
      throw new Error('WebGlShader panic! source must be an instance of ShaderSource!');
    }

    this.source = source;

    const { gl } = glx;
    this.shaderType = gl[source.type];
    this.glShader = gl.createShader(this.shaderType);

    compileShader(this);
  }
}

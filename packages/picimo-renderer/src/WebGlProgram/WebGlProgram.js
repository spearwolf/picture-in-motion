/* eslint no-param-reassign: 0 */
import { getLogger } from 'loglevel';

import WebGlUniform from './WebGlUniform';
import WebGlAttribute from './WebGlAttribute';

const log = getLogger('picimo.renderer.WebGlProgram');

/** @private */
function createAttributes(program) {
  const { gl } = program.glx;
  const len = gl.getProgramParameter(program.glProgram, gl.ACTIVE_ATTRIBUTES);

  program.attributes = {};
  program.attributeNames = [];
  program.attributeLocations = [];

  for (let i = 0; i < len; ++i) {
    const attrib = new WebGlAttribute(program, i);
    program.attributes[attrib.name] = attrib;
    program.attributeNames.push(attrib.name);
    program.attributeLocations.push(attrib.location);
  }
}

/** @private */
function createUniforms(program) {
  const { gl } = program.glx;
  const len = gl.getProgramParameter(program.glProgram, gl.ACTIVE_UNIFORMS);

  program.uniforms = {};
  program.uniformNames = [];

  for (let i = 0; i < len; ++i) {
    const uniform = new WebGlUniform(program, i);
    program.uniforms[uniform.name] = uniform;
    program.uniformNames.push(uniform.name);
  }
}

/** @private */
function linkProgram(program, vertexShader, fragmentShader) {
  const { gl } = program.glx;
  const { glProgram } = program;

  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);

  gl.linkProgram(glProgram);

  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
    throw new Error('WebGlProgram: link panic!');
  }
}

export default class WebGlProgram {
  constructor(renderer, shaderProgram) {
    this.glx = renderer.glx;

    this.vertexShader = renderer.resources.loadVertexShader(shaderProgram.vertexShader);
    this.fragmentShader = renderer.resources.loadFragementShader(shaderProgram.fragmentShader);

    const { gl } = renderer.glx;
    this.glProgram = gl.createProgram();

    linkProgram(this, this.vertexShader.glShader, this.fragmentShader.glShader);
    // TODO gl.deleteShader?

    createUniforms(this);
    createAttributes(this);
  }

  /**
   * @return {boolean}
   */
  use() {
    const { glx } = this;
    if (glx.useProgram(this.glProgram)) {
      glx.enableVertexAttribArrays(this.attributeLocations);
      return true;
    }
    return false;
  }

  /**
   * @param {ShaderContext} shaderContext
   * @param {WebGlRenderer} renderer
   */
  loadUniforms(shaderContext, renderer) {
    this.uniformNames.forEach((name) => {
      let shaderVar = shaderContext.curUniform(name);
      if (shaderVar == null) {
        shaderVar = shaderContext.curTex2d(name);
        if (shaderVar == null) {
          log.error('WebGlProgram: could not load uniform:', name);
        }
        shaderVar.syncTextureAndValue(renderer); // TODO
      }
      this.uniforms[name].setValue(shaderVar.value);
    });
  }

  /**
   * sync buffer before load
   *
   * @param {ShaderContext} shaderContext
   * @param {WebGlRenderer} renderer
   */
  loadAttributes(shaderContext, renderer) {
    this.attributeNames.forEach((name) => {
      const attribValue = shaderContext.curAttrib(name).value;
      renderer.syncBuffer(attribValue).bindBuffer();
      this.attributes[name].vertexAttribPointer(attribValue.descriptor);
    });
  }
}


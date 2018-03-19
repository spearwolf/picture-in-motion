import { getLogger } from 'loglevel';
import { readOption, DataRef } from '@picimo/core';  // eslint-disable-line

import WebGlBuffer from './WebGlBuffer';
import WebGlShader from './WebGlShader';
import WebGlProgram from './WebGlProgram';
import WebGlTexture from './WebGlTexture';

/** @private */
const WEB_GL_BUFFER_USAGE = {
  static: WebGlBuffer.STATIC_DRAW,
  dynamic: WebGlBuffer.DYNAMIC_DRAW,
};

/** @private */
const loadResource = (cache, resource, callback) => {
  let glResource = cache.get(resource.id);
  if (!glResource) {
    glResource = callback(resource);
    cache.set(resource.id, glResource);
  }
  return glResource;
};

/** @private */
const log = getLogger('picimo.renderer.WebGlResourceLibrary');

export default class WebGlResourceLibrary {
  constructor(glx) {
    this.glx = glx;

    /** @private */
    this.vertexShader = new Map();
    /** @private */
    this.fragmentShader = new Map();
    /** @private */
    this.shaderProgram = new Map();
    /** @private */
    this.buffer = new Map();
    /** @private */
    this.texture = new Map();
  }

  /**
   * @param {DataRef} ref - A reference to `VOArray` or `ElementIndexArray`
   * @returns {DataRef} The reference to the `WebGlBuffer`
   */
  loadBuffer(ref) {
    return loadResource(this.buffer, ref, () => {
      if (!(ref.type === 'VOArray' || ref.type === 'ElementIndexArray')) {
        log.warn(`WebGlResourceLibrary.loadBuffer() ref.type="${ref.type}" mismatch! (should be "VOArray" or "ElementIndexArray")`);
        return;
      }
      // I. Create WebGlBuffer
      const target = readOption(ref.hints, 'target', WebGlBuffer.ARRAY_BUFFER);
      const usage = readOption(ref.hints, 'usage', 'dynamic');
      const typedArray = readOption(ref.hints, 'typedArray');
      const glBuffer = new WebGlBuffer(this.glx, target, WEB_GL_BUFFER_USAGE[usage], typedArray);
      // II. Create DataRef
      return new DataRef('WebGlBuffer', glBuffer, { id: ref.id, serial: 0 });
    });
  }

  /**
   * @param {DataRef} ref - A reference to `VOArray` or `ElementIndexArray`
   * @returns {DataRef} The reference to the `WebGlBuffer` or `undefined`
   */
  findBuffer(ref) {
    return this.buffer.get(ref.id);
  }

  /**
   * @param {DataRef} ref - A reference to `VOArray` or `ElementIndexArray`
   */
  freeBuffer(ref) {
    const bufferRef = this.findBuffer(ref);
    if (bufferRef) {
      this.buffer.delete(bufferRef.id);
      bufferRef.data.deleteBuffer();
    }
  }

  /**
   * @param {ShaderSource} shaderSource - vertex shader
   * @returns {WebGlShader}
   */
  loadVertexShader(shaderSource) {
    return loadResource(this.vertexShader, shaderSource, () => new WebGlShader(this.glx, shaderSource));
  }

  /**
   * @param {ShaderSource} shaderSource - fragment shader
   * @returns {WebGlShader}
   */
  loadFragementShader(shaderSource) {
    return loadResource(this.fragmentShader, shaderSource, () => new WebGlShader(this.glx, shaderSource));
  }

  /**
   * @param {ShaderProgram} shaderProgram
   * @returns {WebGlProgram}
   */
  loadProgram(shaderProgram) {
    return loadResource(this.shaderProgram, shaderProgram, () => {
      const vs = this.loadVertexShader(shaderProgram.vertexShader);
      const fs = this.loadFragementShader(shaderProgram.fragmentShader);
      return new WebGlProgram(this.glx, vs, fs);
    });
  }

  /**
   * @param {DataRef} texRef - Reference to texture
   * @returns {DataRef} Reference to WebGlTexture
   */
  loadTexture(texRef) {
    let glTextureRef = this.texture.get(texRef.id);
    if (!glTextureRef) {
      // create WebGlTexture
      const glTex = new WebGlTexture(
        this.glx,
        texRef.data.imgEl,
        texRef.hints.flipY,
        texRef.hints.repeatable,
        texRef.hints.premultiplyAlpha,
        texRef.hints.nearest,
      );
      // create ResourceRef
      glTextureRef = new DataRef('WebGlTexture', glTex, { id: texRef.id, serial: 0 });
      this.texture.set(texRef.id, glTextureRef);
    }
    return glTextureRef;
  }
}

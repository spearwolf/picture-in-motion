import { readOption, DataRef } from '@picimo/core';  // eslint-disable-line

import WebGlBuffer from '../WebGlBuffer';

const WEB_GL_BUFFER_USAGE = {
  static: WebGlBuffer.STATIC_DRAW,
  dynamic: WebGlBuffer.DYNAMIC_DRAW,
};

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
    let bufferRef = this.buffer.get(ref.id);
    if (!bufferRef) {
      if (!(ref.type === 'VOArray' || ref.type === 'ElementIndexArray')) {
        console.warn(`WebGlResourceLibrary.loadBuffer() ref.type mismatch! should be "VOArray" or "ElementIndexArray" but is "${ref.type}"`); // eslint-disable-line
        return;
      }
      // I. Create WebGlBuffer
      const target = readOption(ref.hints, 'target', WebGlBuffer.ARRAY_BUFFER);
      const usage = readOption(ref.hints, 'usage', 'dynamic');
      const glBuffer = new WebGlBuffer(this.glx, target, WEB_GL_BUFFER_USAGE[usage]);
      // II. Create DataRef
      bufferRef = new DataRef('WebGlBuffer', glBuffer, { id: ref.id, serial: 0 });
      this.buffer.set(ref.id, bufferRef);
    }
    return bufferRef;
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
}

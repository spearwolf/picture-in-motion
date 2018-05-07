import WebGlContext from './WebGlContext';

class WebGl2Context extends WebGlContext {
  constructor(gl) {
    super(gl);

    this.isWebGL2 = true;
  }

  vertexAttribDivisor(location, divisor) {
    this.gl.vertexAttribDivisor(location, divisor);
  }

  drawElementsInstanced(mode, count, type, offset, instanceCount) {
    this.gl.drawElementsInstanced(mode, count, type, offset, instanceCount);
  }
}

export default WebGl2Context;

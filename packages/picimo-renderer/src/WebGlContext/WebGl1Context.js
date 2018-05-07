import WebGlContext from './WebGlContext';

class WebGl1Context extends WebGlContext {
  constructor(gl) {
    super(gl);

    this.isWebGL1 = true;

    this.ANGLE_instanced_arrays = gl.getExtension('ANGLE_instanced_arrays');
  }

  vertexAttribDivisor(location, divisor) {
    this.ANGLE_instanced_arrays.vertexAttribDivisorANGLE(location, divisor);
  }

  drawElementsInstanced(mode, count, type, offset, instanceCount) {
    this.ANGLE_instanced_arrays.drawElementsInstancedANGLE(mode, count, type, offset, instanceCount);
  }
}

export default WebGl1Context;

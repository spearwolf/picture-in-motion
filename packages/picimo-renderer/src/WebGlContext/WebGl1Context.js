import WebGlContext from './WebGlContext';

class WebGl1Context extends WebGlContext {
  constructor(gl) {
    super(gl);

    this.isWebGL1 = true;
  }
}

export default WebGl1Context;

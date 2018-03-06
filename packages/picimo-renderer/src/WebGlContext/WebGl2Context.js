import WebGlContext from './WebGlContext';

class WebGl2Context extends WebGlContext {
  constructor(gl) {
    super(gl);

    this.isWebGL2 = true;
  }
}

export default WebGl2Context;

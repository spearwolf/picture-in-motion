/* eslint no-param-reassign: 0 */
import TextureUnitManager from './TextureUnitManager';

// https://developer.mozilla.org/de/docs/Web/API/WebGL_API/WebGL_best_practices
// https://kripken.github.io/emscripten-site/docs/optimizing/Optimizing-WebGL.html

/**
 * @private
 */
const readGlState = (glx) => {
  const { gl } = glx;
  // https://developer.mozilla.org/de/docs/Web/API/WebGLRenderingContext/getParameter

  glx.DEPTH_BITS = gl.getParameter(gl.DEPTH_BITS);
  glx.STENCIL_BITS = gl.getParameter(gl.STENCIL_BITS);
  glx.MAX_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

  glx.boundBuffers.set(gl.ARRAY_BUFFER, gl.getParameter(gl.ARRAY_BUFFER_BINDING));
  glx.boundBuffers.set(gl.ELEMENT_ARRAY_BUFFER, gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING));

  glx.currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
  glx.blendEnabled = gl.getParameter(gl.BLEND);
};

class WebGlContext {
  constructor(gl) {
    this.gl = gl;
    this.contextAttributes = gl.getContextAttributes();

    this.currentBlendMode = null;

    this.boundBuffers = new Map();
    readGlState(this, gl);

    this.boundTextures = new Array(this.MAX_TEXTURE_IMAGE_UNITS);
    for (let i = 0; i < this.boundTextures.length; i++) {
      this.boundTextures[i] = { TEXTURE_2D: null };
    }

    this.textureUnitManager = new TextureUnitManager(this);

    this.enabledVertexAttribLocations = [];

    this.activeTexture(0); // enable first texture unit by default
  }

  bindBuffer(target, buffer) {
    if (this.boundBuffers.get(target) !== buffer) {
      this.gl.bindBuffer(target, buffer);
      this.boundBuffers.set(target, buffer);
    }
  }

  /**
   * @param {number} texUnit
   */
  activeTexture(texUnit) {
    const { gl } = this;
    const tex = gl.TEXTURE0 + texUnit;

    if (this.activeTexUnit !== tex) {
      this.activeTexUnit = tex;
      gl.activeTexture(this.activeTexUnit);
    }
  }

  /**
   * @param {number} glTextureId
   */
  bindTexture2d(glTextureId) {
    const { gl } = this;
    const bound = this.boundTextures[this.activeTexUnit - gl.TEXTURE0];

    if (bound.TEXTURE_2D !== glTextureId) {
      bound.TEXTURE_2D = glTextureId;
      gl.bindTexture(gl.TEXTURE_2D, glTextureId);
    }
  }

  /**
   * @return {boolean}
   */
  useProgram(glProgram) {
    if (this.currentProgram !== glProgram) {
      this.gl.useProgram(glProgram);
      this.currentProgram = glProgram;
      return true;
    }
    return false;
  }

  enableVertexAttribArrays(enableLocations) {
    const { gl } = this;

    this.enabledVertexAttribLocations
      .filter(location => enableLocations.indexOf(location) === -1)
      .forEach((location) => {
        gl.disableVertexAttribArray(location);
        this.enabledVertexAttribLocations.splice(enableLocations.indexOf(location), 1);
      });

    enableLocations.forEach((location) => {
      const idx = this.enabledVertexAttribLocations.indexOf(location);
      if (idx === -1) {
        gl.enableVertexAttribArray(location);
        this.enabledVertexAttribLocations.push(location);
      }
    });
  }

  /**
   * @param {BlendMode} blendMode
   */
  blend(blendMode) {
    if (blendMode === this.currentBlendMode) return;
    this.currentBlendMode = blendMode;

    const { gl } = this;
    if (blendMode.enable) {
      if (!this.blendEnabled) {
        gl.enable(gl.BLEND);
        this.blendEnabled = true;
      }
      gl.blendFunc(gl[blendMode.sfactor], gl[blendMode.dfactor]);
    } else if (this.blendEnabled) {
      gl.disable(gl.BLEND);
      this.blendEnabled = false;
    }
  }
}

export default WebGlContext;

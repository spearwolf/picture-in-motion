
/**
 * @private
 */
export default (tex) => {
  const { gl } = tex.glx;

  tex.bind();

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, tex.flipY);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, tex.premultiplyAlpha);

  const wrap = tex.repeatable ? gl.REPEAT : gl.CLAMP_TO_EDGE;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);

  const filter = tex.nearest ? gl.NEAREST : gl.LINEAR;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tex.imgEl.width, tex.imgEl.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
};

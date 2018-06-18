
/**
 * Returns an array containing 3x values: *red*, *green*, *blue*, *alpha* with each color value in range of [0..1]
 * @param hexColor - css color hex string (with or without leading '#')
 * @param [alpha=1] - alpha value in range [0..1]
 */
export default (hexColor, alpha = 1) => {
  const offset = hexColor.startsWith('#') ? 1 : 0;
  const red = parseInt(hexColor.substring(offset, offset + 2), 16) / 255;
  const green = parseInt(hexColor.substring(offset + 2, offset + 4), 16) / 255;
  const blue = parseInt(hexColor.substring(offset + 4, offset + 6), 16) / 255;
  return [red, green, blue, alpha];
};

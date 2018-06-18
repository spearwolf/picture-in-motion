
/**
 * Returns an array containing 3x values: *red*, *green*, *blue* with each color value in range of [0..1]
 * @param hexColor - css color hex string (with or without leading '#')
 */
export default (hexColor) => {
  const offset = hexColor.startsWith('#') ? 1 : 0;
  const red = parseInt(hexColor.substring(offset, offset + 2), 16) / 255;
  const green = parseInt(hexColor.substring(offset + 2, offset + 4), 16) / 255;
  const blue = parseInt(hexColor.substring(offset + 4, offset + 6), 16) / 255;
  return [red, green, blue];
};

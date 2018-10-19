
/**
 * Converts an array containing (3-4)x color values [0..255] to float values [0..1].
 * Returns a new array, the old one will be untouched.
 */
export default colors => colors.map(col => col / 255);


/**
 * Converts an array containing (3-4)x color values [0..255] to float values [0..1]
 */
export default colors => colors.map(col => col / 255);

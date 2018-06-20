
/**
 * @param {number} n
 * @return {boolean}
 */
const isPowerOf2 = n => n !== 0 && (n & (n - 1)) === 0;

export default isPowerOf2;

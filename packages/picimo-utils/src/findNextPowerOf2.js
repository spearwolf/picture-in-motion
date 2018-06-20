
/**
 * @param {number} x
 * @return {number}
 */
function findNextPowerOf2(x) {
  let p = 1;
  while (x > p) p <<= 1;
  return p;
}

export default findNextPowerOf2;

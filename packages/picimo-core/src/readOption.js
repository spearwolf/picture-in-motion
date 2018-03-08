
/**
 * @private
 */
export default (options, propName, defValue, funcArgs) => {
  if (options) {
    const val = options[propName];
    if (val !== undefined) return val;
  }
  if (typeof defValue === 'function') {
    return defValue.call(null, funcArgs);
  }
  return defValue;
};

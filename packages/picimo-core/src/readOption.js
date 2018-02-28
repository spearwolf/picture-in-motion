
/** @private */
export default (options, propName, defValue) => {
  if (options) {
    const val = options[propName];
    if (val !== undefined) return val;
  }
  if (typeof defValue === 'function') {
    return defValue();
  }
  return defValue;
};

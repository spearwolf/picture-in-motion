
export default (options, propName, defValue) => {
  if (options) {
    const val = options[propName];
    if (val !== undefined) return val;
  }
  return defValue;
};

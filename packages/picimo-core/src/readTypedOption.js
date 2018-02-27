
export default (options, propName, propType, defValue) => {
  if (options) {
    const val = options[propName];
    if (typeof val === propType) return val;
  }
  return defValue;
};


/** @private */
const arrayAccessor = new RegExp(/(.+)\[(\d+)\]$/);

/** @private */
const getProp = (obj, prop) => {
  const aa = arrayAccessor.exec(prop);
  if (aa) {
    const val = obj[aa[1]];
    if (val != null) {
      return val[parseInt(aa[2], 10)];
    }
    return;
  }
  return obj[prop];
};

/**
 * A rough and unpolished version of lodash's `get()`
 * @param {Object} obj
 * @param {string} path - The property path. Supports `.` (dots) and `[1]` (array access) syntax.
 */
const get = (obj, path) => {
  if (obj != null) {
    if (path in obj) {
      return obj[path];
    }
    const items = path.split(/[.]/);
    const val = getProp(obj, items.shift());
    if (val != null && items.length) {
      return get(val, items.join('.'));
    }
    return val;
  }
};

export default get;

/* eslint no-param-reassign: 0 */
import { get } from '@picimo/utils'; // eslint-disable-line

import { PROPERTY_CALL } from '../constants';

/** @private */
export const findPropertyCall = (statements, withName, callback) => {
  if (statements) {
    const found = statements.find(({ type, name }) => type === PROPERTY_CALL && name === withName);
    if (found !== undefined && callback) {
      callback(found);
    }
    return found;
  }
};

/** @private */
export const hasPropertyCall = (statements, withName) => Boolean(findPropertyCall(statements, withName));

/** @private */
export const firstPropertyCallArg = (statements, name) => get(findPropertyCall(statements, name), 'args[0]');

/** @private */
export const setByFirstPropertyCallArg = (target, targetKey, statements, name) => findPropertyCall(statements, name || targetKey, (data) => {
  target[targetKey] = get(data, 'args[0]'); // eslint-disable-line
});

/** @private */
export const readFlag = (flag, defValue) => {
  if (flag == null) return defValue;
  if (flag.args && flag.args.length === 1) return Boolean(flag.args[0]);
  return true;
};

/** @private */
export const setFlagByPropertyCall = (to, statements, name) => {
  const flag = findPropertyCall(statements, name);
  if (flag !== undefined) {
    to[name] = readFlag(flag); // eslint-disable-line
  }
};

/** @private */
export const readPropertyFlag = (statements, name, defValue) => readFlag(findPropertyCall(statements, name), defValue);

/** @private */
export const findNamedArgument = (args, withName, callback) => args && args.find(({ name, value }) => {
  const found = name === withName;

  if (found && callback) {
    callback(value);
  }

  return found;
});

/** @private */
export const setByNamedArgument = (args, target, name) => findNamedArgument(args, name, (value) => {
  target[name] = value;
});

/** @private */
export const findData = (args, withName, callback) => args && args.find((data) => {
  const found = data.name === withName;

  if (found && callback) {
    callback(data);
  }

  return found;
});

/** @private */
export const attachDataValue = (to, from, name) => findData(from, name, ({ value }) => Object.assign(to, { [name]: value }));

/** @private */
export const attachDataValues = (to, from, names) => names.forEach(attachDataValue.bind(null, to, from));

/** @private */
export const parseVoDefaultValues = target => (name, value) => {
  if (value !== undefined) {
    if (Array.isArray(value)) {
      value.forEach((val, idx) => {
        target[`${name}${idx}`] = val;
      });
    } else {
      target[name] = value;
    }
  }
};


/** @private */
export const readOption = (...options) => (key, defVal = undefined) => options.reduce((curVal, opt) => {
  if (typeof opt === 'function') {
    const val = opt(key);
    return val !== undefined ? val : curVal;
  }
  return opt && key in opt ? opt[key] : curVal;
}, defVal);

/** @private */
export const assignOptions = (to, options, read, substitute) => {
  options.forEach((key) => {
    let val = read(key);
    if (substitute && typeof val === 'string') {
      val = substitute(val);
    }
    if (val !== undefined) {
      to[key] = val;
    }
  });
  return to;
};

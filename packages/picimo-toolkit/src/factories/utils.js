import get from 'lodash/get';

import { PROPERTY_CALL } from '../constants';

/** @private */
export const findPropertyCall = (statements, withName) => statements && statements.find(({ type, name }) => type === PROPERTY_CALL && name === withName);

/** @private */
export const hasPropertyCall = (statements, withName) => Boolean(findPropertyCall(statements, withName));

/** @private */
export const firstPropertyCallArg = (statements, name) => get(findPropertyCall(statements, name), 'args[0]');

/** @private */
export const findNamedArgument = (args, withName, callback) => args && args.find(({ name, value }) => {
  const found = name === withName;

  if (found && callback) {
    callback(value);
  }

  return found;
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

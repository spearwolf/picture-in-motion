import { readOption } from '@picimo/core';

export default (canvas, options) => {
  return readOption(options, 'foo', 'plah');
};

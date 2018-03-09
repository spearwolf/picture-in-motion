/* eslint-env jest */
import assert from 'assert';

import { pick } from '.';

describe('pick', () => {
  it('should work', () => {
    const result = pick(['foo', 'plah'])({ foo: 123, bar: 456, plah: undefined });
    assert.deepEqual(result, {
      foo: 123,
    });
  });

  it('should return a new object even the given object is null', () => {
    const result = pick(['foo', 'plah'])();
    assert.ok(result);
    assert.strictEqual(typeof result, 'object');
  });
});

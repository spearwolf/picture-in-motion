/* eslint-env jest */
import assert from 'assert';

import { DataRef } from '.';

describe('DataRef', () => {
  it('create instance', () => {
    const data = {};
    const dataType = 666;
    const hints = { foo: 'bar' };
    const ref = new DataRef(dataType, data, hints);
    assert.strictEqual(ref.data, data);
    assert.strictEqual(ref.type, dataType);
    assert.strictEqual(ref.serial, 1);
    assert.strictEqual(typeof ref.id, 'string');
    assert.deepEqual(ref.hints, hints);
  });

  it('create instance with :serial hint', () => {
    const ref = new DataRef(666, {}, { serial: 100 });
    assert.strictEqual(ref.serial, 100);
  });

  it('create instance with :id hint', () => {
    const ref = new DataRef(666, {}, { id: 'fooBar' });
    assert.strictEqual(ref.id, 'fooBar');
  });

  it('create instance with a not-a-string:id hint should convert the :id to a string value', () => {
    const ref = new DataRef(666, {}, { id: 666 });
    assert.strictEqual(ref.id, '666');
  });

  it('updating data should increase serial and set new data reference', () => {
    const data = { v: 1 };
    const ref = new DataRef(666, data);
    assert.strictEqual(ref.data, data);
    assert.strictEqual(ref.serial, 1);
    ref.data = { v: 2 };
    assert.notStrictEqual(ref.data, data);
    assert.strictEqual(ref.serial, 2);
  });

  it('updating data should leaves serial untouched if the reference did not change', () => {
    const data = { v: 1 };
    const ref = new DataRef(666, data);
    assert.strictEqual(ref.data, data);
    assert.strictEqual(ref.serial, 1);
    ref.data = data;
    assert.strictEqual(ref.data, data);
    assert.strictEqual(ref.serial, 1);
  });

  it('touch() should increase serial', () => {
    const ref = new DataRef(123, {});
    assert.strictEqual(ref.serial, 1);
    ref.touch();
    assert.strictEqual(ref.serial, 2);
  });

  it('hasHint() should work as expected', () => {
    const ref = new DataRef('ttt', {}, {
      truthy: true,
      falsy: false,
      blank: null,
      undef: undefined,
      foo: 'bar',
    });
    assert.strictEqual(ref.hasHint('truthy', true), true, 'truthy is true');
    assert.strictEqual(ref.hasHint('truthy', false), false, 'truthy is not false');
    assert.strictEqual(ref.hasHint('truthy'), true, 'truthy exists');
    assert.strictEqual(ref.hasHint('falsy', true), false, 'falsy is not true');
    assert.strictEqual(ref.hasHint('falsy', false), true, 'falsly is false');
    assert.strictEqual(ref.hasHint('falsy'), true, 'falsy exists');
    assert.strictEqual(ref.hasHint('blank', null), true, 'blank is null');
    assert.strictEqual(ref.hasHint('blank', undefined), false, 'blank is not undefined');
    assert.strictEqual(ref.hasHint('blank'), true, 'blank exists');
    assert.strictEqual(ref.hasHint('undef', undefined), true, 'undef is undefined');
    assert.strictEqual(ref.hasHint('undef', null), false, 'undef is not null');
    assert.strictEqual(ref.hasHint('undef'), true, 'undef exists');
    assert.strictEqual(ref.hasHint('foo', 'bar'), true, 'foo is bar');
    assert.strictEqual(ref.hasHint('foo', 'foo'), false, 'foo is not bar');
    assert.strictEqual(ref.hasHint('foo'), true, 'foo exists');
    assert.strictEqual(ref.hasHint('unknown', undefined), false, 'unknown is not undefined');
    assert.strictEqual(ref.hasHint('unknown', null), false, 'unknown is not null');
    assert.strictEqual(ref.hasHint('unknown'), false, 'unknown does not exist');
  });
});

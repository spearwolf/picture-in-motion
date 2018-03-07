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
});

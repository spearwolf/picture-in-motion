/* eslint-env jest */
import assert from 'assert';

import ResourceRef from './ResourceRef';

describe('ResourceRef', () => {
  it('create instance', () => {
    const data = {};
    const dataType = 666;
    const hints = { foo: 'bar' };
    const ref = new ResourceRef(dataType, data, hints);
    assert.strictEqual(ref.resource, data);
    assert.strictEqual(ref.resourceType, dataType);
    assert.strictEqual(ref.serial.value, 1);
    assert.strictEqual(typeof ref.id, 'string');
    assert.deepEqual(ref.hints, hints);
  });

  it('create instance with :serial hint', () => {
    const ref = new ResourceRef(666, {}, { serial: 100 });
    assert.strictEqual(ref.serial.value, 100);
  });

  it('create instance with :id hint', () => {
    const ref = new ResourceRef(666, {}, { id: 'fooBar' });
    assert.strictEqual(ref.id, 'fooBar');
  });

  it('create instance with a not-a-string:id hint should convert the :id to a string value', () => {
    const ref = new ResourceRef(666, {}, { id: 666 });
    assert.strictEqual(ref.id, '666');
  });

  it('updating resource should increase serial and set new resource reference', () => {
    const data = { v: 1 };
    const ref = new ResourceRef(666, data);
    assert.strictEqual(ref.resource, data);
    assert.strictEqual(ref.serial.value, 1);
    ref.resource = { v: 2 };
    assert.notStrictEqual(ref.resource, data);
    assert.strictEqual(ref.serial.value, 2);
  });

  it('updating resource should leaves serial untouched if the reference did not change', () => {
    const data = { v: 1 };
    const ref = new ResourceRef(666, data);
    assert.strictEqual(ref.resource, data);
    assert.strictEqual(ref.serial.value, 1);
    ref.resource = data;
    assert.strictEqual(ref.resource, data);
    assert.strictEqual(ref.serial.value, 1);
  });

  it('touch() should increase serial', () => {
    const ref = new ResourceRef(123, {});
    assert.strictEqual(ref.serial.value, 1);
    ref.touch();
    assert.strictEqual(ref.serial.value, 2);
  });
});

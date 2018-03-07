/* eslint-env jest */
import ResourceRef from './ResourceRef';

describe('ResourceRef', () => {
  it('create instance', () => {
    const data = {};
    const dataType = 666;
    const hints = { foo: 'bar' };
    const ref = new ResourceRef(dataType, data, hints);
    expect(ref.resource).toBe(data);
    expect(ref.resourceType).toBe(dataType);
    expect(ref.serial.value).toBe(1);
    expect(typeof ref.id).toBe('string');
    expect(ref.hints).toEqual(hints);
  });

  it('create instance with :serial hint', () => {
    const ref = new ResourceRef(666, {}, { serial: 100 });
    expect(ref.serial.value).toBe(100);
  });

  it('create instance with :id hint', () => {
    const ref = new ResourceRef(666, {}, { id: 'fooBar' });
    expect(ref.id).toBe('fooBar');
  });

  it('create instance with a not-a-string:id hint should convert the :id to a string value', () => {
    const ref = new ResourceRef(666, {}, { id: 666 });
    expect(ref.id).toBe('666');
  });

  it('updating resource should increase serial and set new resource reference', () => {
    const data = { v: 1 };
    const ref = new ResourceRef(666, data);
    expect(ref.resource).toBe(data);
    expect(ref.serial.value).toBe(1);
    ref.resource = { v: 2 };
    expect(ref.resource).not.toBe(data);
    expect(ref.serial.value).toBe(2);
  });

  it('updating resource should leaves serial untouched if the reference did not change', () => {
    const data = { v: 1 };
    const ref = new ResourceRef(666, data);
    expect(ref.resource).toBe(data);
    expect(ref.serial.value).toBe(1);
    ref.resource = data;
    expect(ref.resource).toBe(data);
    expect(ref.serial.value).toBe(1);
  });

  it('touch() should increase serial', () => {
    const ref = new ResourceRef(123, {});
    expect(ref.serial.value).toBe(1);
    ref.touch();
    expect(ref.serial.value).toBe(2);
  });
});

/* eslint-env jest */
import VOArray from './VOArray';

describe('VOArray', () => {
  it('create instance', () => {
    const voa = new VOArray(4, 16, ['float32', 'int16', 'uint8']);

    expect(voa.buffer.byteLength).toEqual(64);
    expect(voa.buffer).toBe(voa.arrayBuffer);
    expect(voa.buffer).toBe(voa.float32Array.buffer);
    expect(voa.buffer).toBe(voa.int16Array.buffer);
    expect(voa.buffer).toBe(voa.uint8Array.buffer);
    expect(voa.int32Array).toBeUndefined();
    expect(voa.int8Array).toBeUndefined();
    expect(voa.uint32Array).toBeUndefined();
    expect(voa.uint16Array).toBeUndefined();
  });

  it('create instance should clone arrayTypes (no copy)', () => {
    const arrayTypes = ['float32', 'int16', 'uint8'];
    const voa = new VOArray(4, 16, arrayTypes);

    expect(voa.arrayTypes).not.toBe(arrayTypes);
    expect(voa.arrayTypes).toEqual(arrayTypes);
  });

  it('create from existing buffer should create a view into existing buffer', () => {
    const values = Uint32Array.from([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
    ]);

    const voa = new VOArray(2, 16 * Uint32Array.BYTES_PER_ELEMENT, ['uint32'], values);

    expect(voa.buffer.byteLength).toEqual(128);
    expect(voa.buffer).not.toBe(voa.arrayBuffer);
    expect(voa.arrayBuffer).toBe(values.buffer);
    expect(Array.from(voa.uint32Array)).toEqual(Array.from(values));
  });

  it('subarray() should create a new VOArray using the same internal buffer', () => {
    const values = Uint32Array.from([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
      33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    ]);

    const a = new VOArray(3, 16 * Uint32Array.BYTES_PER_ELEMENT, ['uint32'], values);
    const b = a.subarray(1, 1);

    expect(values.buffer.byteLength).toEqual(3 * 16 * Uint32Array.BYTES_PER_ELEMENT);
    expect(b.buffer.byteLength).toEqual(16 * Uint32Array.BYTES_PER_ELEMENT);
    expect(b.arrayBuffer).toBe(a.arrayBuffer);

    a.uint32Array[17] = 666;

    expect(Array.from(b.uint32Array)).toEqual([
      17, 666, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
    ]);
  });

  it('copy() without offset', () => {
    const data = new Float32Array(3 * 16);
    data.set([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
      33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    ]);

    const a = new VOArray(3, 16 * Float32Array.BYTES_PER_ELEMENT, ['float32'], data.buffer);
    const b = new VOArray(4, 16 * Float32Array.BYTES_PER_ELEMENT, ['float32']);

    b.copy(a, 0);

    expect(Array.from(b.float32Array)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
      33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });

  it('copy() with offset', () => {
    const floats = Uint32Array.from([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
      33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    ]);

    const a = new VOArray(3, 16 * Uint32Array.BYTES_PER_ELEMENT, ['uint32'], floats);
    const b = new VOArray(4, 16 * Uint32Array.BYTES_PER_ELEMENT, ['uint8', 'float32', 'uint32']);

    b.copy(a, 1);

    expect(Array.from(b.uint32Array)).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
      33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
    ]);
  });
});

/* eslint-env jest */
import { maxOf } from '.';

describe('maxOf', () => {
  it('should work', () => {
    expect(maxOf(0, 0)).toBe(0);
    expect(maxOf(-1, -1)).toBe(-1);
    expect(maxOf(-3, 9)).toBe(9);
    expect(maxOf(9, -3)).toBe(9);
  });
});

/* eslint-env mocha */
import { assert } from 'chai';

import Mat4 from './Mat4';
import Projection from './Projection';
import ProjectionUniform from './ProjectionUniform';

describe('ProjectionUniform', () => {
  it('create', () => {
    const projection = new Projection({ width: 640, height: 360, fit: 'contain' });
    const uniform = new ProjectionUniform(projection, 'plah');
    assert.instanceOf(uniform.data, Mat4, 'data should be instance of Mat4');
    assert.strictEqual(uniform.serial, 0);
    assert.strictEqual(uniform.name, 'plah');
    assert.strictEqual(uniform.projection, projection);
  });

  it('create without name argument', () => {
    const projection = new Projection({ width: 640, height: 360, fit: 'contain' });
    const uniform = new ProjectionUniform(projection);
    assert.instanceOf(uniform.data, Mat4, 'data should be instance of Mat4');
    assert.strictEqual(uniform.serial, 0);
    assert.strictEqual(uniform.name, 'projection');
    assert.strictEqual(uniform.projection, projection);
  });

  it('update()', () => {
    const projection = new Projection({ width: 640, height: 360, fit: 'contain' });
    const uniform = new ProjectionUniform(projection);
    assert.strictEqual(uniform.serial, 0);

    uniform.update(600, 600);
    assert.strictEqual(uniform.serial, 1, 'first update() should increase serial');

    uniform.update(600, 600);
    assert.strictEqual(uniform.serial, 1, 'second update() should not increase serial because the size has not changed');

    uniform.update(900, 900);
    assert.strictEqual(uniform.serial, 1, 'third update() should not increase serial because the size has not changed');

    uniform.update(1920, 1200);
    assert.strictEqual(uniform.serial, 2, 'fourth update() should increase serial because the size changed');
  });
});

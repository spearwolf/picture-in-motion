/* eslint-env mocha */
import assert from 'assert';

import ShaderVariable from './ShaderVariable';
import ShaderUniformVariable from './ShaderUniformVariable';
import ShaderAttribVariable from './ShaderAttribVariable';
import ShaderTexture2dVariable from './ShaderTexture2dVariable';

describe('ShaderVariable', () => {
  it('new ShaderVariable() without value', () => {
    const val = new ShaderVariable('foo', ShaderVariable.UNIFORM);
    assert.equal(val.data, undefined);
    assert.equal(val.serial, 0);

    const uniform = new ShaderUniformVariable('uni');
    assert.equal(uniform.data, undefined);
    assert.equal(uniform.serial, 0);

    const attrib = new ShaderAttribVariable('attr');
    assert.equal(attrib.data, undefined);
    assert.equal(attrib.serial, 0);

    const tex = new ShaderTexture2dVariable('tex');
    assert.equal(tex.data, undefined);
    assert.equal(tex.serial, 0);
  });

  it('new ShaderUniformVariable() with hints', () => {
    const uniform = new ShaderUniformVariable('uni', 666, { foo: 'bar' });
    assert.equal(uniform.data, 666);
    assert.equal(uniform.serial, 0);
    assert.equal(uniform.hint('foo'), 'bar');
  });

  it('serial increase on value change', () => {
    const val = new ShaderVariable('bar', ShaderVariable.ATTRIB);
    val.data = 16;
    assert.equal(val.serial, 1);
    val.data = 32;
    assert.equal(val.serial, 2);
    val.data = 32;
    assert.equal(val.serial, 2);
  });

  it('touch()', () => {
    const val = new ShaderVariable('plah', ShaderVariable.TEXTURE_2D);
    assert.equal(val.serial, 0);
    val.touch();
    assert.equal(val.serial, 1);
  });
});

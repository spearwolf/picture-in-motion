/* eslint-env mocha */
import assert from 'assert';

import ShaderVariable from './ShaderVariable';
import ShaderVariableAlias from './ShaderVariableAlias';
import ShaderVariableGroup from './ShaderVariableGroup';
import ShaderVariableBufferGroup from './ShaderVariableBufferGroup';
import ShaderUniformVariable from './ShaderUniformVariable';
import ShaderAttribVariable from './ShaderAttribVariable';
import ShaderTexture2dVariable from './ShaderTexture2dVariable';

import {
  ShaderContext,
  VODescriptor,
  VOPool,
} from '.';

describe('ShaderContext', () => {
  describe('new ShaderContext', () => {
    const ctx = new ShaderContext();

    it('returns an object', () => assert(ctx));

    it('add a shader *uniform* variable', () => {
      const sVar = new ShaderUniformVariable('foo', 23);
      ctx.pushVar(sVar);
      assert.equal(ctx.curVar(sVar).data, 23);
      assert.equal(ctx.curUniform(sVar.name).data, 23);
    });

    it('add a shader *attrib* variable', () => {
      const sVar = new ShaderAttribVariable('bar', 66);
      ctx.pushVar(sVar);
      assert.equal(ctx.curVar(sVar).data, 66);
      assert.equal(ctx.curAttrib(sVar.name).data, 66);
    });

    it('add a shader *tex2d* variable', () => {
      const sVar = new ShaderTexture2dVariable('plah', 2008);
      ctx.pushVar(sVar);
      assert.equal(ctx.curVar(sVar).data, 2008);
      assert.equal(ctx.curTex2d(sVar.name).data, 2008);
    });

    it('push and pop variables', () => {
      const sVar1 = new ShaderVariable('p', ShaderVariable.UNIFORM, 16);
      const sVar2 = new ShaderVariable('p', ShaderVariable.UNIFORM, 32);
      const sVar3 = new ShaderVariable('p', ShaderVariable.UNIFORM, 64);

      assert.equal(ctx.curVar(sVar1), null);

      ctx.pushVar(sVar1);
      assert.equal(ctx.curVar(sVar1).data, 16);

      ctx.pushVar(sVar2);
      assert.equal(ctx.curVar(sVar1).data, 32);

      ctx.pushVar(sVar3);
      assert.equal(ctx.curVar(sVar1).data, 64);

      ctx.pushVar(new ShaderVariable('p', ShaderVariable.UNIFORM, 100));
      ctx.pushVar(new ShaderVariable('p', ShaderVariable.UNIFORM, 101));
      ctx.pushVar(new ShaderVariable('p', ShaderVariable.UNIFORM, 102));
      assert.equal(ctx.curVar(sVar1).data, 102);

      ctx.popVar(sVar3);
      assert.equal(ctx.curVar(sVar1).data, 32);

      ctx.popVar(sVar2);
      assert.equal(ctx.curVar(sVar1).data, 16);

      ctx.popVar(sVar1);
      assert.equal(ctx.curVar(sVar1), null);

      ctx.popVar(sVar1);
      ctx.popVar(sVar2);
      ctx.popVar(sVar3);
      assert.equal(ctx.curVar(sVar1), null);
    });
  });

  describe('ShaderVariableGroup -> ShaderContext', () => {
    const ctx = new ShaderContext();
    let group;

    it('create', () => {
      const sVarA = new ShaderUniformVariable('poiu', 666);
      assert.equal(sVarA.data, 666);

      const sVarB = new ShaderVariableAlias('ghjk', sVarA);
      assert.equal(sVarB.data, 666);

      group = new ShaderVariableGroup([sVarA, sVarB]);
      assert.equal(group.shaderVars.length, 2);
    });

    it('push to context', () => {
      assert.equal(ctx.curUniform('poiu'), null, ':poiu should be null');
      assert.equal(ctx.curUniform('ghjk'), null, ':ghjk should be null');
      // group.pushVar(ctx)
      ctx.pushVar(group);
      assert.equal(ctx.curUniform('poiu').data, 666);
      assert.equal(ctx.curUniform('ghjk').data, 666);
    });

    it('pop from context', () => {
      assert.equal(ctx.curUniform('poiu').data, 666);
      assert.equal(ctx.curUniform('ghjk').data, 666);
      // group.popVar(ctx)
      ctx.popVar(group);
      assert.equal(ctx.curUniform('poiu'), null, ':poiu should be null');
      assert.equal(ctx.curUniform('ghjk'), null, ':ghjk should be null');
    });
  });

  describe('ShaderVariableBufferGroup', () => {
    const descriptor = new VODescriptor({
      // vertex elements layout
      // ----------------------
      //
      // v0: (x0)(y0)(z0)(r0)(g0)(b0)(a)(tx)(ty)
      // v1: (x1)(y1)(z1)(r0)(g1)(b1)(a)(tx)(ty)
      // v2: (x2)(y2)(z2)(r0)(g2)(b2)(a)(tx)(ty)
      //
      vertexCount: 3,

      attributes: [
        {
          name: 'position',
          type: 'float32',
          size: 3,
          attrNames: [
            'x',
            'y',
            'z',
          ],
        },
        {
          name: 'color',
          type: 'uint8',
          size: 4,
          attrNames: [
            'r',
            'g',
            'b',
            'a',
          ],
        },
        {
          name: 'translate',
          type: 'uint16',
          size: 2,
          attrNames: [
            'tx',
            'ty',
          ],
          uniform: true,
        },
        {
          name: 'b',
          type: 'uint8',
          size: 1,
          uniform: true,
        },
      ],
    });

    const voPool = new VOPool(descriptor);
    const group = new ShaderVariableBufferGroup(voPool);

    it('new ShaderVariableGroup(new VOPool(descriptor))', () => {
      assert.equal(group.shaderVars.length, 4);
      assert.deepEqual(group.shaderVars.map(sVar => sVar.name).sort(), ['position', 'color', 'translate', 'b'].sort());
    });

    it('ShaderAttribVariable.data = { descriptor, bufferSource }', () => {
      assert.equal(group.shaderVars[0].data.descriptor, descriptor);
      assert.equal(group.shaderVars[0].data.bufferSource, voPool);
      assert.equal(group.shaderVars[1].data.descriptor, descriptor);
      assert.equal(group.shaderVars[1].data.bufferSource, voPool);
    });

    it('bufferSource', () => {
      assert.strictEqual(group.bufferSource, voPool);
    });

    it('serial & touch', () => {
      const curSerial = group.shaderVars[0].serial;
      assert.equal(curSerial, group.serial);
      group.touch();
      assert.equal(curSerial + 1, group.serial);
      assert.equal(group.serial, group.shaderVars[0].serial);
    });
  });
});

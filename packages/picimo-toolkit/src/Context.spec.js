/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { expect } from 'chai';
import { get } from 'lodash';

import { compile, Context } from '.';

describe('Context', () => {
  describe('compile()', () => {
    let ctx;

    before(() => {
      ctx = compile(`
        FOO = 42
        bar.plah = 23

        VertexObject myVertices {
          @vertexCount(4)

          position: uint32 {
            x
            y
          }
          rotate: uint16 @uniform
          foo @alias(rotate)
        }
      `);
      console.log('Context', ctx);
    });

    it('returns an instance of Context', () => {
      expect(ctx).to.be.an.instanceOf(Context);
    });

    it('should have "FOO" option', () => {
      expect(ctx.readOption('FOO')).to.equal(42);
    });

    it('should have "bar.plah" option', () => {
      expect(ctx.readOption('bar.plah')).to.equal(23);
    });

    it('should have "myVertices" declaration', () => {
      expect(get(ctx.declaration, 'myVertices.declarationType')).to.equal('vertexobject');
    });

    it('shoud have myVertices.voDescriptor section', () => {
      expect(get(ctx.declaration, 'myVertices.voDescriptor')).to.deep.equal({
        vertexCount: 4,
        attributes: [
          {
            name: 'position',
            type: 'uint32',
            scalars: [
              'x',
              'y',
            ],
            size: 2,
          },
          {
            name: 'rotate',
            type: 'uint16',
            uniform: true,
          },
        ],
        aliases: {
          foo: 'rotate',
        },
      });
    });
  });
});

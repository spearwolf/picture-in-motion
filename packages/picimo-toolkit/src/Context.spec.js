/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { expect } from 'chai';
import { get } from 'lodash';

import { VODescriptor } from '@picimo/core'; // eslint-disable-line

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
            x [-FOO, FOO, 666, bar.plah ]
            y
          }
          rotate: uint16 @uniform 90.5
          foo @alias(rotate)
        }
      `);
      console.log('Context:compile', ctx);
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

    it('shoud have "myVertices.voDescriptor" section', () => {
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

    it('shoud have "myVertices.voNew" section', () => {
      expect(get(ctx.declaration, 'myVertices.voNew')).to.deep.equal({
        rotate: 90.5,
        x0: -42,
        x1: 42,
        x2: 666,
        x3: 23,
      });
    });
  });

  describe('create()', () => {
    describe('VertexObject', () => {
      let ctx;
      let vod;

      before(() => {
        ctx = compile(`

          VertexObject MyVertices {
            @vertexCount(3)

            position {
              x
              y
            }
            rotate: uint16 @uniform
          }
        `, {

          MyVertices: {
            fooBar() {
              return this.x0 + 1234;
            },
          },
        });

        console.log('Context:create(VertexObject)', ctx);

        vod = ctx.create('MyVertices');
      });

      it('create an instance of VODescriptor', () => {
        expect(vod).to.be.an.instanceOf(VODescriptor);
        expect(vod.vertexCount).to.equal(3);
        expect(vod.hasAttribute('position', 2)).to.equal(true);
        expect(vod.hasAttribute('rotate', 1)).to.equal(true);
      });

      it('VODescriptor should get "proto" from Context.config', () => {
        const vo = vod.createVO();
        expect(vo.fooBar).to.be.a('function');

        vo.x0 = 1000;
        expect(vo.fooBar()).to.equal(2234);
      });
    });
  });
});

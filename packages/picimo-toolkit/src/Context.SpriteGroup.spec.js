/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { expect } from 'chai';

import {
  IndexedPrimitive,
  SpriteGroup,
  VODescriptor,
} from '@picimo/core'; // eslint-disable-line

import { compile } from '.';

describe('SpriteGroup', () => {
  before(() => console.groupCollapsed('SpriteGroup'));
  after(() => console.groupEnd());

  describe('create()', () => {
    let ctx;

    before(() => {
      ctx = compile(`

        VertexObject MyVertices {
          @vertexCount(4)

          position {
            x
            y
          }
          size {
            w
            h
          }
        }

        Primitive TriQuads {
          @type(TRIANGLES)
          @generate

          stride 4
          offset 0

          indices [
            0, 1, 2,
            0, 2, 3,
          ]
        }

      `);
      console.log(ctx);
    });

    it('@vertexObject, maxAllocVOSize', () => {
      const sg = ctx.compile(`

        SpriteGroup MySpriteGroup {
          @vertexObject(MyVertices)

          maxAllocVOSize 5
        }

      `).create('MySpriteGroup', { capacity: 9 });

      expect(sg).to.be.an.instanceOf(SpriteGroup);
      expect(sg.descriptor).to.be.an.instanceOf(VODescriptor);
      expect(sg.capacity).to.equal(9);
      expect(sg.voPool.maxAllocVOSize).to.equal(5);
    });

    it('@setSize', () => {
      const fooBar = () => 0;
      const sg = ctx.compile(`

        SpriteGroup sprites1 {
          @vertexObject(MyVertices)

          capacity 10

          @setSize(fooBar)
        }

      `, {
        fooBar,
      }).create('sprites1');

      expect(sg.spriteHook.setSize).to.equal(fooBar);
    });

    it('@primitive', () => {
      const sg = ctx.compile(`

        SpriteGroup MySpriteGroup {
          @vertexObject(MyVertices)
          @primitive(TriQuads)

          maxAllocVOSize 5
        }

      `).create('MySpriteGroup', { capacity: 2 });

      expect(sg).to.be.an.instanceOf(SpriteGroup);
      expect(sg.descriptor).to.be.an.instanceOf(VODescriptor);
      expect(sg.primitive).to.be.an.instanceOf(IndexedPrimitive);
    });

    it('SpriteGroup > @prototype', () => {
      const sg = ctx.compile(`

        SpriteGroup MySpriteGroup {
          @vertexObject(MyVertices)
          @primitive(TriQuads)

          maxAllocVOSize 5

          MyVertices {
            @prototype(SpriteProto)
          }
        }

      `, {
        SpriteProto: {
          fooBar() {
            return this.x0 + 1024;
          },
        },
      }).create('MySpriteGroup', { capacity: 1 });

      expect(sg).to.be.an.instanceOf(SpriteGroup);
      expect(sg.descriptor).to.be.an.instanceOf(VODescriptor);

      const vo = sg.createSprite();

      expect(vo.fooBar).to.be.a('function');

      vo.x0 = 1000;
      expect(vo.fooBar()).to.equal(2024);
    });

    it('@prototype as option: MyVertices > @prototype', () => {
      const sg = ctx.compile(`

        SpriteGroup MySpriteGroup {
          @vertexObject(MyVertices)
          @primitive(TriQuads)

          maxAllocVOSize 5
        }

      `).create('MySpriteGroup', {
        capacity: 1,

        MyVertices: {
          prototype: {
            fooBar() {
              return this.x0 + 2048;
            },
          },
        },
      });

      expect(sg).to.be.an.instanceOf(SpriteGroup);
      expect(sg.descriptor).to.be.an.instanceOf(VODescriptor);

      const vo = sg.createSprite();

      expect(vo.fooBar).to.be.a('function');

      vo.x0 = 1000;
      expect(vo.fooBar()).to.equal(3048);
    });
  });
});
